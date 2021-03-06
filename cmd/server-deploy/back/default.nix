let
  sources = import ../../../build/deps/nix/sources.nix;
  nixpkgs = import sources.nixpkgs { };
  bin = import ../../../build/utils/bin;

  awscli2 = (import (nixpkgs.fetchzip {
    url = "https://github.com/nixos/nixpkgs/archive/024f5b30e0a3231dbe99c30192f92ba0058d95f5.zip";
    sha256 = "0cdrah6qj0ax65l48l6rsngvbcxhzxn6ywyk341r9pi1m29jc6jd";
  }) { }).awscli2;
in
  nixpkgs.stdenv.mkDerivation (
       (import ../../../build/utils/ctx)
    // (rec {
      name = "server-deploy";

      buildInputs = [
        awscli2
        nixpkgs.docker
      ];

      oci = nixpkgs.dockerTools.buildLayeredImage {
        config.Entrypoint = ["bash" "-c"];
        contents = bin.allDependencies ++ [ nixpkgs.bash ];
        maxLayers = 125;
        name = "oci";
        tag = "latest";
      };
    })
  )
