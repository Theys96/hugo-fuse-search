# Hugo fuse-search [![Build Status](https://travis-ci.org/Theys96/hugo-fuse-search.svg?branch=master)](https://travis-ci.org/Theys96/hugo-fuse-search)

Drop-in ready-to-use search solution for static site generator [Hugo](https://github.com/gohugoio/hugo).

The goal of this project is a ready-to-use package to paste into your Hugo theme to allow for dynamic search 
functionality within your Hugo website. Various customizable components will be included.

The basis of this project is [this GitHub Gist](https://gist.github.com/cmod/5410eae147e4318164258742dd053993) by Craig Mod.

## Preview

The current implementation is heavily under construction. It includes for example a dynamic search bar which can be opened at the top of the page. In the [anatole](https://github.com/lxndrblz/anatole/) theme this looks like the following.

![Anatole preview](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/anatole.gif)

Here, to open the searchbar enter Cmd+/ and use the arrow keys and Enter to navigate the results (or just click them).

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
     {{- partial "fuse-search/footer.html" . -}}
     ```

## Configuration

1. Activate search in your `config.toml` or `config.yaml` (example in toml):
  
   ``` 
   [outputs]
   home = ["HTML", "RSS", "JSON"]
   
   [params.search]
   enabled = true
   keyboardControlled = "topSearchbar"
   
   [params.search.topSearchbar]
   enabled = true
   ```
	
	The `outputs.home` setting is set to instruct Hugo to output a `index.json` file which is used by the search engine to index the website. The `search.enabled` parameter can be used to turn search on and off. This parameter can also be set in front matter to allow for search on a per-page basis. The `search.keyboardControlled` parameter configures that the top searchbar can be controlled with the keyboard (e.g. using the Cmd+/ command and the arrow keys).
	
2. (optional) Further configure hugo-fuse-search:

   ```
   [params.search.topSearchbar]
   position = "center"
   ```
   
   Of course, you can also customize the CSS that is shipped with hugo-fuse-search.

## Options

Currently, the full possible configuration looks like the the following (pseudo YAML).

```
params:
  search: 
    enabled: true / false
    keyboardControlled: topSearchbar / fullscreenSearchbar
    topSearchbar:
      enabled: true / false
      position: left / center / right
    fullscreenSearchbar:
      enabled: true / false
      color: dark / light
```

## Searchbars

Currently, there are 3 different "searchbars" included in this project:

* The `top-searchbar`:
  
  ![top searchbar](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/top-searchbar.png)
  
  It can be enabled with `params.search.topSearchbar.enabled = true`.
  
* The `fullscreen-searchbar`:
  
  ![fullscreen searchbar](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/fullscreen-searchbar.png)
  
  It can be enabled with `params.search.fullscreenSearchbar = true`.
  
* The `inline-searchbar`:
  
  ![inline searchbar](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/inline-searchbar.png)
  
  It can be included in a page with the `{{< fuse-search/inline-searchbar >}}` shortcode. This components still needs a lot of improvement.

The top-searchbar and fullscreen-searchbar can be controlled with the keyboard if configured as such. Alternatively, the javascript `fusesearchTopSearchbar.initSearch()` and `fusesearchFullscreenSearchbar.initSearch()` can be used to open those searchbars programmatically. Note that any element (such as a button) which has the class `fuse-search-element`, can be clicked without the searchbar being closed (regularly, the searchbar is closed when the user clicks outside it). 


