import esbuild from 'esbuild';

esbuild.build({
    entryPoints : ["./src/**/*"],
    outdir : "dist/",
    format : "esm",
    platform : "node",
    treeShaking : true,
    minify : true,
    splitting : true,
    loader : { '.sample' : "text"},
    packages : "bundle",
    sourcemap : "external" 
    
})