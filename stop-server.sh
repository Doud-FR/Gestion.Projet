#!/bin/bash

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    kill $PID 2>/dev/null
    rm server.pid
    echo "✅ Serveur arrêté"
else
    pkill -f "node dist/server.js"
    echo "✅ Tous les processus arrêtés"
fi
