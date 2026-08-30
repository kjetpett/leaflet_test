# leaflet_test

Test av ESRI Leaflet (og arcgis javascript)

Online: https://yellow-hill-07d67bf03.azurestaticapps.net

## Python virtual environment (.venv) with uv

### Create the environment

From project root:

```bash
uv venv .venv
```

If uv needs an explicit Python path on macOS:

```bash
uv venv .venv --python /opt/homebrew/bin/python3
```

### Activate the environment

macOS/Linux:

```bash
source .venv/bin/activate
```

Windows (PowerShell):

```powershell
.venv\Scripts\Activate.ps1
```

### Install required modules for GeoPackage export

```bash
uv pip install -r requirements.txt
```

### Run the exporter

```bash
python python_scripts/export_gpkg_to_geojson.py
```

