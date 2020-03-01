#!/bin/bash

if hash aws 2>/dev/null; then
    echo 'AWS CLI already installed'
else
    wget https://s3.amazonaws.com/aws-cli/awscli-bundle.zip -O /tmp/awscli-bundle.zip
    unzip /tmp/awscli-bundle.zipa -d /tmp
    sudo /tmp/awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
    /tmp/awscli-bundle/install -b ~/bin/aws
fi

if hash sam 2>/dev/null; then
    echo 'SAM CLI already installed'
else
    pip install --user aws-sam-cli
fi

