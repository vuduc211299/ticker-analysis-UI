import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "es-toolkit/compat/get": "es-toolkit/dist/compat/object/get.js",
      "es-toolkit/compat/isPlainObject": "es-toolkit/dist/compat/predicate/isPlainObject.js",
      "es-toolkit/compat/last": "es-toolkit/dist/compat/array/last.js",
      "es-toolkit/compat/maxBy": "es-toolkit/dist/compat/math/maxBy.js",
      "es-toolkit/compat/minBy": "es-toolkit/dist/compat/math/minBy.js",
      "es-toolkit/compat/omit": "es-toolkit/dist/compat/object/omit.js",
      "es-toolkit/compat/range": "es-toolkit/dist/compat/math/range.js",
      "es-toolkit/compat/sortBy": "es-toolkit/dist/compat/array/sortBy.js",
      "es-toolkit/compat/sumBy": "es-toolkit/dist/compat/math/sumBy.js",
      "es-toolkit/compat/throttle": "es-toolkit/dist/compat/function/throttle.js",
      "es-toolkit/compat/uniqBy": "es-toolkit/dist/compat/array/uniqBy.js",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "es-toolkit/compat/get$": "es-toolkit/dist/compat/object/get.js",
      "es-toolkit/compat/isPlainObject$": "es-toolkit/dist/compat/predicate/isPlainObject.js",
      "es-toolkit/compat/last$": "es-toolkit/dist/compat/array/last.js",
      "es-toolkit/compat/maxBy$": "es-toolkit/dist/compat/math/maxBy.js",
      "es-toolkit/compat/minBy$": "es-toolkit/dist/compat/math/minBy.js",
      "es-toolkit/compat/omit$": "es-toolkit/dist/compat/object/omit.js",
      "es-toolkit/compat/range$": "es-toolkit/dist/compat/math/range.js",
      "es-toolkit/compat/sortBy$": "es-toolkit/dist/compat/array/sortBy.js",
      "es-toolkit/compat/sumBy$": "es-toolkit/dist/compat/math/sumBy.js",
      "es-toolkit/compat/throttle$": "es-toolkit/dist/compat/function/throttle.js",
      "es-toolkit/compat/uniqBy$": "es-toolkit/dist/compat/array/uniqBy.js",
    };

    return config;
  },
};

export default nextConfig;
