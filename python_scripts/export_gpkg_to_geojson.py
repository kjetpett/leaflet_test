#!/usr/bin/env python3
"""Export layers/tables from a GeoPackage to individual GeoJSON files.

Spatial layers (data_type=features) are exported with GeoPandas.
Attribute tables (data_type=attributes) are exported as GeoJSON FeatureCollections
with null geometry and row values under properties.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path
from typing import Any

import geopandas as gpd


DEFAULT_GPKG_PATH = Path("db/lamokart.gpkg")
DEFAULT_OUTPUT_DIR = Path("geojson")


def safe_filename(name: str) -> str:
    """Create a filename-safe layer name while keeping it readable."""
    return "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in name)


def read_gpkg_contents(gpkg_path: Path) -> list[tuple[str, str]]:
    """Read table names and data types from gpkg_contents."""
    with sqlite3.connect(gpkg_path) as con:
        cur = con.cursor()
        cur.execute(
            """
            SELECT table_name, data_type
            FROM gpkg_contents
            ORDER BY table_name
            """
        )
        rows = cur.fetchall()

    return [(str(table_name), str(data_type)) for table_name, data_type in rows]


def export_feature_layer(gpkg_path: Path, layer_name: str, output_path: Path) -> None:
    """Export one spatial layer to GeoJSON."""
    gdf = gpd.read_file(gpkg_path, layer=layer_name)
    gdf.to_file(output_path, driver="GeoJSON")


def export_attribute_table(gpkg_path: Path, table_name: str, output_path: Path) -> None:
    """Export one non-spatial attribute table as GeoJSON with null geometry."""
    with sqlite3.connect(gpkg_path) as con:
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        cur.execute(f'SELECT * FROM "{table_name}"')
        rows = cur.fetchall()

    features: list[dict[str, Any]] = []
    for row in rows:
        properties = {k: row[k] for k in row.keys()}
        features.append(
            {
                "type": "Feature",
                "properties": properties,
                "geometry": None,
            }
        )

    collection = {
        "type": "FeatureCollection",
        "name": table_name,
        "features": features,
    }

    output_path.write_text(json.dumps(collection, ensure_ascii=False, indent=2), encoding="utf-8")


def export_all(gpkg_path: Path, output_dir: Path) -> None:
    """Export all supported content tables from the GeoPackage."""
    output_dir.mkdir(parents=True, exist_ok=True)

    contents = read_gpkg_contents(gpkg_path)
    if not contents:
        print("No content tables found in gpkg_contents.")
        return

    exported = 0
    skipped = 0

    for table_name, data_type in contents:
        out_name = safe_filename(table_name) + ".geojson"
        out_path = output_dir / out_name

        try:
            if data_type == "features":
                export_feature_layer(gpkg_path, table_name, out_path)
                print(f"Exported feature layer: {table_name} -> {out_path}")
                exported += 1
            elif data_type == "attributes":
                export_attribute_table(gpkg_path, table_name, out_path)
                print(f"Exported attribute table: {table_name} -> {out_path}")
                exported += 1
            else:
                print(f"Skipped unsupported table type '{data_type}' for table '{table_name}'.")
                skipped += 1
        except Exception as exc:
            print(f"Failed to export '{table_name}' ({data_type}): {exc}")
            skipped += 1

    print(f"Done. Exported: {exported}, Skipped/Failed: {skipped}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export all GeoPackage tables to GeoJSON files.")
    parser.add_argument(
        "--gpkg",
        type=Path,
        default=DEFAULT_GPKG_PATH,
        help="Path to input GeoPackage (default: db/lamokart.gpkg)",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Output folder for GeoJSON files (default: geojson)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    gpkg_path = args.gpkg
    output_dir = args.out

    if not gpkg_path.exists():
        raise FileNotFoundError(f"GeoPackage not found: {gpkg_path}")

    export_all(gpkg_path, output_dir)


if __name__ == "__main__":
    main()
