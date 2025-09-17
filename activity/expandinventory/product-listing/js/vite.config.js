import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
root: 'src',
build: {
outDir: '../dist',
rollupOptions: {
input: {
main: path.resolve(__dirname, 'src/index.html'),
product_listing: path.resolve(__dirname, 'src/product_listing/index.html')
}
}
}
});