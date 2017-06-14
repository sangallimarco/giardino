#!/bin/bash
# create build and start server

cd app
npm run build

NODE_ENV=production node index.js 