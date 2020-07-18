#!/bin/bash
# Takes files related to this project out of a Hugo
# project which can be used to develop the fuse-search
# code in a live Hugo project server

# Hugo directory and files. Change as necessary.
hugoProject="../some-hugo-project/themes/some-theme/"
files=( \
 "assets/css/fuse-search.css" \
 "assets/js/fuse-search.js" \
 "layouts/_default/index.json" \
 "layouts/partials/fuse-search/footer.html" \
 "layouts/partials/fuse-search/head.html" \
 "layouts/shortcodes/fuse-search/inline-searchbar.html"
)

# Confirmation
echo "Note: This script will attempt to overwrite the files in this project with files from the $hugoProject directory."
read -p "Are you sure? " -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
 echo 
 exit 1
fi
echo 

# Execute
for file in "${files[@]}"
do
 cp "$hugoProject$file" "$file"
done

