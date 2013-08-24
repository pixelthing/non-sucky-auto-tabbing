#!/bin/sh

set -e

handle_fail() {
    echo; echo "Build failed"
    exit 1
}

OutMinFile='output/auto-tabbing.min.js'
OutDebugFile='output/auto-tabbing.TEMP.js'

# Delete output and temporary files (ensures we can write to them)
rm -f $OutMinFile $OutDebugFile.temp $OutMinFile.temp || true

cat closure-pre.js > $OutDebugFile.temp
cat ../auto-tabbing.js >> $OutDebugFile.temp

# Patch the file, so closure doesn't clober property/method access so closure doesn't clobber it
cat $OutDebugFile.temp | perl -pe 's/\.(\w+)(?=[.() ;:,])/["\1"]/g' > $OutDebugFile.temp.bak
mv $OutDebugFile.temp.bak $OutDebugFile.temp

# Now call Google Closure Compiler to produce a minified version
curl -d output_info=compiled_code -d output_format=text -d compilation_level=ADVANCED_OPTIMIZATIONS \
--data-urlencode js_code@$OutDebugFile.temp "http://closure-compiler.appspot.com/compile" > $OutMinFile.temp

# Finalise each file by prefixing with version header
cp version-header.js $OutMinFile
cat $OutMinFile.temp                >> $OutMinFile

# Delete the odd files left behind on Mac
rm -f output/*.js~

# Remove temp files
rm output/*.temp

echo; echo "Build succeeded `date`"



