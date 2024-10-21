import esbuild from 'esbuild';

esbuild.build({
    entryPoints : ["./src/**/*"],
    outdir : "dist/",
    outbase : "src/",
    format : "esm",
    platform : "node",
    treeShaking : true,
    minify : true,
    splitting : true,
    loader : { '.sample' : "text"},
    
})