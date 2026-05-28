#!/bin/bash
# Dobbeltklikk denne filen for å starte læresystemet MED Claude-retting.
# (Vanlig bruk uten retting: bare dobbeltklikk index.html i stedet.)
cd "$(dirname "$0")"
echo "Starter læresystem med Claude-retting ..."
echo "Lar nettleseren åpne seg automatisk. Lukk dette vinduet (eller Ctrl+C) for å stoppe."
( sleep 1.5; open "http://localhost:8787" ) &
node bridge.js
