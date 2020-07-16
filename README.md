# Hugo fuse-search

Drop-in ready-to-use search solution for static site generator [Hugo](https://github.com/gohugoio/hugo).

The goal of this project is a ready-to-use package to paste into your Hugo theme to allow for dynamic search 
functionality within your Hugo website. Various customizable components will be included.

The basis of this project is [this GitHub Gist](https://gist.github.com/cmod/5410eae147e4318164258742dd053993) by Craig Mod. My aim is to expand what he has created to something that can be easily included in any Hugo theme.

## Preview

The current implementation is quite minimal. It adds a dynamic search bar which can be opened at the top of the page with Cmd+/. In the [anatole](https://github.com/lxndrblz/anatole/) theme this looks like the following.

![Anatole preview](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/anatole.gif)

## Installation

1. First, download or clone this repository. 
2. Merge the `assets` and `layouts` folder from this repository into your active Hugo theme or project. Merging folders can be done on Mac with e.g. `ditto hugo-fuse-search/layouts <your-theme>/layouts` and on Linux with `rsync -a hugo-fuse-search/layouts <your-theme>/layouts`.
3. Add the necessary components in your templates:
   
   - In the `<head>`:
     
     ```
     {{ partial "fuse-search/head.html" . }}
     ```
   - At the end but within the `<body>`:
     
     ```
     {{- partial "fuse-search/top-searchbar.html" . -}}
     {{- partial "fuse-search/footer.html" . -}}
     ```
  
4. Activate search in your `config.toml` or `config.yaml` (example in toml):
  
   ``` 
   [outputs]
   home = ["HTML", "RSS", "JSON"]
   
   [params.search]
   enabled = true
   ```

5. (optional) Further configure hugo-fuse-search:

   ```
   [params.search.topSearchbar]
   position = "center"
   ```
   
   Of course, you can also customize the CSS that is shipped with hugo-fuse-search.