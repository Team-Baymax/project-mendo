var dest = ".";
var src = '.';

module.exports = {
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
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
    src: "*.html",
    dest: dest
  },
  scripts: {
    src: src + "/js/**/*.js",
    dest: dest
  }
};
