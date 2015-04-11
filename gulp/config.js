var src = './src';
var dest = "./build";

module.exports = {
  browserSync: {
    // proxy into expressJS server
    proxy: {
      host: "http://localhost",
      port: "5000"
    }
  },
  sass: {
    src: [ src + "/sass/**/*.{sass,scss}", src + "/bower_components/compass-mixins/**/*.{sass,scss}" ],
    dest: dest + "/css",
    settings: {
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: '/media' // Used by the image-url helper
    }
  },
  markup: {
    src: src + "/htdoc/**/*.html",
    dest: dest
  },
  images: {
    src: src + "/media/**",
    dest: dest + "/media"
  },
  scripts: {
    src: src + "/js/**/*.js",
    dest: dest + "/js"
  }
};
