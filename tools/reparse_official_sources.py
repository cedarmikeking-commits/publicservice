#!/usr/bin/env python3
"""Reparse retained downloaded originals; do not modify HTML-text evidence inputs."""
import subprocess,sys
from pathlib import Path
p=Path(__file__).resolve().parent
for name in ['parse_initial.py','parse_additional_a.py','parse_additional_b.py','parse_additional_c.py','parse_additional_d.py','parse_additional_e.py']:
 subprocess.run([sys.executable,str(p/name)],check=True)
print('Original attachment parsing complete. Now run build_verified_directory.py and render_coverage_report.py.')
