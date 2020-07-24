# Hugo fuse-search [![Build Status](https://travis-ci.org/Theys96/hugo-fuse-search.svg?branch=master)](https://travis-ci.org/Theys96/hugo-fuse-search)

Drop-in ready-to-use search solution for static site generator [Hugo](https://github.com/gohugoio/hugo).

The goal of this project is to create a ready-to-use package to paste into your Hugo theme to allow for dynamic search 
functionality within your Hugo website. Various customizable components are included.

The basis of this project is [this GitHub Gist](https://gist.github.com/cmod/5410eae147e4318164258742dd053993) by Craig Mod.

## Preview

The current implementation is heavily under construction. It includes for example a dynamic search bar which can be opened at the top of the page. In the [anatole](https://github.com/lxndrblz/anatole/) theme this looks like the following.

![Anatole preview](https://raw.githubusercontent.com/theys96/hugo-fuse-search/master/meta/anatole.gif)

Here, to open the searchbar enter Cmd+/ and use the arrow keys and Enter to navigate the results (or just click them).

## Installation

[(Wiki page)](https://github.com/Theys96/hugo-fuse-search/wiki/Installation)

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
	
For more configuration specifics, check out the Wiki page on [Configuration and Customization](https://github.com/Theys96/hugo-fuse-search/wiki/Configuration-and-Customization).

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


