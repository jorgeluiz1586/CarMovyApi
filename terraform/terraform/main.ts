// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { KeyPair } from "@cdktf/provider-aws/lib/key-pair";
import { Instance } from "@cdktf/provider-aws/lib/instance";
import * as fs from 'fs';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pubKey = fs.readFileSync("myEc2Key.pub", "utf8");

    new AwsProvider(this, "aws", {
        region: "us-west-2",
    });

    const keyPair = new KeyPair(this, "keypair", {
        keyName: "myEc2Key",
        publicKey: pubKey,
    });

    const machine = new Instance(this, "machine", {
        ami: "ami-0ecc74eca1d66d8a6",
        instanceType: "t2.micro",
        keyName: keyPair.keyName,
    });

    new TerraformOutput(this, "public_ip", {
        value: machine.publicIp
    })
  }
}

const app = new App();
new MyStack(app, "terraform");
app.synth();
