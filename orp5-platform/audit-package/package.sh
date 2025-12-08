#!/bin/bash
# Assemble the audit package
mkdir -p audit-package/fixes
mkdir -p audit-package/tests

# Copy Tests
cp tests/*.spec.ts audit-package/tests/

# Copy Reports (these should be generated in the root or copied from artifacts)
# This script assumes you have the files. 

# Build the zip
zip -r audit-package.zip audit-package
