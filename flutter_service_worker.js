'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "422688836338984213af6bf80a9e7314",
"assets/assets/icons/adresa.svg": "3853fc2b3c7d0ea6a92dc6ba90edca32",
"assets/assets/icons/brojkomada.svg": "2bc4df217c0e64ce1fa65c3a8489aece",
"assets/assets/icons/brojspratova.svg": "b89adcf845e943cb47fa01a9aa3b2fbd",
"assets/assets/icons/cijena.svg": "44ea98d08605c3830b6c2bbe8f73fb7d",
"assets/assets/icons/dimenzije.svg": "c07ee6147584d7582e43aaadae8716b1",
"assets/assets/icons/dodatno.svg": "4b25a29234f6cfc9b64861691eada699",
"assets/assets/icons/dostava.svg": "5388106b93fbab435b2166e0401ceef1",
"assets/assets/icons/imeiprezime.svg": "9688c7752b9c0b4a17bbf65ec2776be5",
"assets/assets/icons/kartica.svg": "a214e816f13b501d012fa099b4d64d43",
"assets/assets/icons/kes.svg": "ee737f1aee10cb1dcd072281e7dcbca3",
"assets/assets/icons/napomena.svg": "8e13e4e16212ac1d0df22dae6e42d048",
"assets/assets/icons/opis.svg": "834d03ef2918cba3207094dc2eecfa96",
"assets/assets/icons/sifra.svg": "04a2524204e7b6494c02721670bcbc96",
"assets/assets/icons/sprat1.svg": "061d02aa39afcbb31b1e8e6cba27acc4",
"assets/assets/icons/sprat2.svg": "17956d67e27691fe4552adcfb2c1d7ed",
"assets/assets/icons/sprat3.svg": "9654db68144d523b149329821d632645",
"assets/assets/icons/sprat4.svg": "f772158d21fcec1ee37ce69b53efbe9a",
"assets/assets/icons/stalak.svg": "97e641877cc024f54bc46b0f803bbc22",
"assets/assets/icons/telefon.svg": "293dc0e02b076d9538b5dda2f2d0019b",
"assets/assets/images/cake.png": "99802071828453a4a70b95eace4c9e42",
"assets/assets/images/cake2.png": "843211ad4cdd02e7e716e9f9a9c3ae94",
"assets/assets/images/cake3.jpg": "142df2a8f597c624332d704e7b5649c0",
"assets/assets/images/cake3.png": "6fe04fe0ff964457a8296d40c621d06c",
"assets/assets/images/cake_bg.jpg": "53a5993de17587013db7cc9006ed23d1",
"assets/assets/images/cake_bg2.jpg": "25cf0c380197cfab2e7e7bfea77df78f",
"assets/assets/ripple.gif": "4c57bb09f44f74f88738d5736d865d2b",
"assets/assets/spinner.gif": "4c84f884269ddfe855ffde3c6ef0a9bb",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "39451b2aec2d63735ea646149a52e09f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "f7096d62d06f519b747ae45568cab369",
"/": "f7096d62d06f519b747ae45568cab369",
"main.dart.js": "5fd21c5bd1889bde519233ddec0af55e",
"manifest.json": "386113d311775046e240356c46141178",
"version.json": "759723b8e1b7c02cc53329d57c735ab8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
