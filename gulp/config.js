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
    src: [ src + "/sass/**/*.{sass,scss}" ],
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
  fonts: {
    src: src + "/sass/fonts/*.otf",
    dest: dest + "/css/fonts"
  },
  images: {
    src: src + "/media/**",
    dest: dest + "/media"
  },
  // scripts: {
  //   src: src + "/js/**/*.js",
  //   dest: dest + "/js"
  // },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
      {
        entries: src + '/js/app-doctor.js',
        dest: dest + '/js',
        outputName: 'app-doctor.js',
        extensions: ['.hbs']
      },
      {
        entries: src + '/js/app-patient.js',
        dest: dest + '/js',
        outputName: 'app-patient.js',
        extensions: ['.hbs']
      },
      {
        entries: src + '/js/app-control.js',
        dest: dest + '/js',
        outputName: 'app-control.js',
        extensions: ['.hbs']
      },
      {
        entries: src + '/js/jquery-knob.js',
        dest: dest + '/js',
        outputName: 'jquery-knob.js'
      },
    ]
  }
};
