'use strict';

var express = require('express');

exports.getAppRoutes = function(expressApp) {
            // TBD - recurse over route tree to replace triple loop.
            const result = [];

            expressApp._router.stack.forEach(layer => {
                if (layer.route) {
                    result.push(layer);
                } else if (layer.name === 'router') {
                    const regexp = layer.regexp.source;
                    const prefix_routes = regexp.match(/(\w+)+/gi);
                    let prefix = '';
                    if (prefix_routes !== null) {
                        prefix_routes.forEach(prefix_route => {
                            prefix += `/${prefix_route}`
                        });
                    }
                    layer.handle.stack.forEach(handler => {
                        if (handler.route.stack) {
                            handler.route.stack.forEach(endRoute => {
                                const method = endRoute.method ? endRoute.method.toUpperCase() : null;
                                const route = handler.route.path;
                                result.push({method: method, path: prefix + route});
                            });
                        }
                    });
                }
            });
            return result;
        };
