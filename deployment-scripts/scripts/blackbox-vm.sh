#!/bin/bash -e
curl -LSso /usr/local/bin/app https://storage.googleapis.com/artifacts.gcd-jr-demo.appspot.com/server-linux
chmod +x /usr/local/bin/app
adduser --system --shell /sbin/nologin --home /var/app app
chmod 755 /var/app
touch /etc/systemd/system/app.service
cat <<EOF | tee /etc/systemd/system/app.service
Description=Binary server start
After=network.target google-instance-setup.service google-network-setup.service
After=networking.service

[Service]
Type=simple
UMask=022
WorkingDirectory=/var/app
ExecStart=/usr/local/bin/app
Restart=always
User=app

[Install]
WantedBy=multi-user.target
EOF

systemctl enable app
systemctl start app

