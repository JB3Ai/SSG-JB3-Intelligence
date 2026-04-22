// ============================================================
// SENTINEL EYE - Copernicus Data Space Ecosystem Integration
// Free satellite imagery via CDSE WMS
// https://sh.dataspace.copernicus.eu/ogc/wms/{instanceId}
//
// Two CDSE configurations (set in .env.local):
//   S2 (sentinel-eye-mining) — Sentinel-2 optical layers
//   S1 (sentinel-eye-sar)    — Sentinel-1 SAR radar layers
// ============================================================

export type SatelliteLayer =
  | 'TRUE_COLOR'
  | 'FALSE_COLOR'
  | 'NDVI'
  | 'BSI'
  | 'GEOLOGY'
  | 'MOISTURE_INDEX'
  | 'AGRICULTURE'
  | 'SWIR'
  | 'ATMOSPHERIC_PENETRATION'
  | 'SAR_VV';

// SAR layers route to the S1 instance; all others use S2
const SAR_LAYERS = new Set<SatelliteLayer>(['SAR_VV']);

// Map internal layer type names to actual CDSE-configured WMS layer names.
// The S1 instance uses IW (Interferometric Wide) prefix naming convention.
const WMS_LAYER_NAMES: Partial<Record<SatelliteLayer, string>> = {
  SAR_VV: 'IW_VV',
};

/**
 * Returns the correct CDSE instance ID for the given layer.
 * Optical layers (S2) and SAR layers (S1) live in separate CDSE configurations.
 */
export function getInstanceIdForLayer(
  layer: SatelliteLayer,
  s1InstanceId: string,
  s2InstanceId: string
): string {
  return SAR_LAYERS.has(layer) ? s1InstanceId : s2InstanceId;
}

// -------------------------------------------------------
// Evalscript overrides
//
// Only layers listed here will send a custom EVALSCRIPT in
// the WMS request, overriding the CDSE dashboard config.
//
// BSI: the CDSE dashboard "BSI" layer is Bare Ice Index
// (NDBI), not the Bare Soil Index needed for mining
// detection.  Override with the correct formula:
//   ((B11 + B04) - (B08 + B02)) / ((B11 + B04) + (B08 + B02))
// -------------------------------------------------------
const EVALSCRIPT_OVERRIDES: Partial<Record<SatelliteLayer, string>> = {
  BSI: `//VERSION=3
function setup() {
  return { input: ["B11","B08","B04","B02"], output: { bands: 3 } };
}
function evaluatePixel(s) {
  var bsi = ((s.B11 + s.B04) - (s.B08 + s.B02)) / ((s.B11 + s.B04) + (s.B08 + s.B02));
  if (bsi < 0.0) return [0.0, 0.2, 0.4];
  if (bsi < 0.1) return [0.1, 0.3, 0.3];
  if (bsi < 0.2) return [0.5, 0.4, 0.2];
  if (bsi < 0.3) return [0.8, 0.5, 0.15];
  if (bsi < 0.4) return [0.9, 0.3, 0.1];
  return [1.0, 0.15, 0.05];
}`,
};

// Human-readable labels and colors for the UI
export const SATELLITE_LAYER_META: Record<
  SatelliteLayer,
  { label: string; description: string; color: string; source: string; category: 'Optical' | 'SAR' }
> = {
  TRUE_COLOR:              { label: 'True Color',             description: 'Natural RGB — baseline visual reference',                     color: '#06B6D4', source: 'Sentinel-2', category: 'Optical' },
  FALSE_COLOR:             { label: 'False Color (NIR)',       description: 'Red = vegetation, grey = bare ground / urban',               color: '#EF4444', source: 'Sentinel-2', category: 'Optical' },
  NDVI:                    { label: 'NDVI (Vegetation)',       description: 'Green = healthy veg, red = bare / dead cover',               color: '#10B981', source: 'Sentinel-2', category: 'Optical' },
  BSI:                     { label: 'Bare Soil Index',         description: 'Red = exposed earth / active digging, blue = vegetated',     color: '#F59E0B', source: 'Sentinel-2', category: 'Optical' },
  GEOLOGY:                 { label: 'Geology',                 description: 'Rock & mineral type differentiation via SWIR bands',         color: '#D97706', source: 'Sentinel-2', category: 'Optical' },
  MOISTURE_INDEX:          { label: 'Moisture Index',          description: 'Blue = wet soil, brown = dry — track seepage / tailings',    color: '#3B82F6', source: 'Sentinel-2', category: 'Optical' },
  AGRICULTURE:             { label: 'Agriculture',             description: 'Crop health & land-use change detection',                    color: '#84CC16', source: 'Sentinel-2', category: 'Optical' },
  SWIR:                    { label: 'SWIR',                    description: 'Shortwave infrared — penetrates haze, reveals soil/rock',    color: '#F97316', source: 'Sentinel-2', category: 'Optical' },
  ATMOSPHERIC_PENETRATION: { label: 'Atmospheric Penetration', description: 'Haze & smoke penetration for obscured mine sites',           color: '#A78BFA', source: 'Sentinel-2', category: 'Optical' },
  SAR_VV:                  { label: 'SAR Radar (VV)',          description: 'Day/night all-weather radar — bright = rough, dark = smooth', color: '#8B5CF6', source: 'Sentinel-1', category: 'SAR'     },
};

/**
 * Build a CDSE WMS tile URL for use as a Mapbox raster tile source.
 * The {bbox-epsg-3857} token is replaced automatically by Mapbox GL JS.
 *
 * Pass the correct instanceId for the layer type:
 *   - S2 instance for optical layers (TRUE_COLOR, NDVI, BSI, etc.)
 *   - S1 instance for SAR layers (SAR_VV)
 * Use getInstanceIdForLayer() to resolve this.
 */
export function buildWmsTileUrl(
  layer: SatelliteLayer,
  instanceId: string,
  dateFrom: string,
  dateTo: string,
  maxCloudCoverage = 20
): string {
  // Parameters whose values contain no characters that URLSearchParams would mangle
  const params: Record<string, string> = {
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetMap',
    LAYERS: WMS_LAYER_NAMES[layer] ?? layer,
    STYLES: '',
    WIDTH: '512',
    HEIGHT: '512',
    TRANSPARENT: 'true',
    TIME: `${dateFrom}/${dateTo}`,
  };

  // MAXCC (cloud coverage) only applies to optical imagery (Sentinel-2).
  // Sentinel-1 SAR is radar — sending MAXCC causes the S1 endpoint to reject.
  if (!SAR_LAYERS.has(layer)) {
    params.MAXCC = String(maxCloudCoverage);
  }

  const safeParams = new URLSearchParams(params);

  // Build URL; append problematic params manually to avoid encoding issues:
  //   CRS/FORMAT: contain ':' and '/' which are safe in query-string values but
  //               URLSearchParams encodes them unnecessarily
  //   EVALSCRIPT: base64 contains '+', '/', '=' — encodeURIComponent handles these
  //               correctly so the server can decode them
  //   BBOX: must stay as a literal Mapbox substitution token
  let url = `https://sh.dataspace.copernicus.eu/ogc/wms/${instanceId}?${safeParams.toString()}`;
  url += `&CRS=EPSG:3857`;
  url += `&FORMAT=image/png`;

  const override = EVALSCRIPT_OVERRIDES[layer];
  if (override) {
    url += `&EVALSCRIPT=${encodeURIComponent(btoa(override))}`;
  }

  url += `&BBOX={bbox-epsg-3857}`;
  return url;
}

/**
 * Get default date range (last 30 days)
 */
export function getDefaultDateRange(): { from: string; to: string } {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return {
    from: thirtyDaysAgo.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
  };
}
