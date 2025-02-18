import { throttle } from "throttle-debounce";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { renderGrid } from "@giphy/js-components";
import { environment } from "src/environments/environment";

const getWidth = () => window.innerWidth;
// const keys = environment.gifKey;
// const getRandomKey = (keys: string[]): string => {
//   const randomIndex = Math.floor(Math.random() * keys.length);
//   return keys[randomIndex];
// };
// const randomKey = getRandomKey(keys);
// const gf = new GiphyFetch(randomKey);
// paginator
var fetchGifs;

export class VanillaJSGrid {
  mountNode: HTMLElement;
  el: HTMLElement;
  gifType;
  searchKey;
  filetype;
  width: number;
  gif: GiphyFetch;
  constructor() {
    let keys = environment.gifKey;
    let getRandomKey = (keys: string[]): string => {
      const randomIndex = Math.floor(Math.random() * keys.length);
      return keys[randomIndex];
    };
    const randomKey = getRandomKey(keys);
    this.gif = new GiphyFetch(randomKey);
  }
  render = () => {
    var element = document.getElementById("upper-gif-section");
    const width = element.clientWidth == 0 ? 500 : element.clientWidth;
    this.el = renderGrid(
      {
        width,
        fetchGifs,
        columns: width < 300 ? 2 : 3,
        gutter: 6,
        user: {},
        noLink: true,
      },
      this.mountNode
    ) as unknown as HTMLElement;
  };
  trending(mountNode: HTMLElement, width) {
    this.width = width;
    const resizeRender = throttle(500, () => this.render());
    window.addEventListener("resize", resizeRender, false);
    this.mountNode = mountNode;
    fetchGifs = (offset: number) => this.gif.trending({ offset, limit: 50 });
    this.render();
  }
  remove() {
    this.el.parentNode.removeChild(this.el);
  }
  searching(mountNode: HTMLElement, search, type, width) {
    this.width = width;
    this.mountNode = mountNode;
    this.searchKey = search;
    fetchGifs = (offset: number) =>
      this.gif.search(this.searchKey, { offset, limit: 50, type: type });
    const resizeRender = throttle(500, () => this.render());
    window.addEventListener("resize", resizeRender, false);
    this.el = renderGrid(
      {
        width,
        fetchGifs,
        columns: width < 300 ? 2 : 3,
        gutter: 6,
        user: {},
        noLink: true,
      },
      this.mountNode
    ) as unknown as HTMLElement;
  }
  stickers(mountNode: HTMLElement, width) {
    this.width = width;
    this.mountNode = mountNode;
    fetchGifs = (offset: number) =>
      this.gif.search("stickers", { offset, limit: 50 });
    const resizeRender = throttle(500, () => this.render());
    window.addEventListener("resize", resizeRender, false);
    this.el = renderGrid(
      {
        width,
        fetchGifs,
        columns: width < 300 ? 2 : 3,
        gutter: 6,
        user: {},
        noLink: true,
      },
      this.mountNode
    ) as unknown as HTMLElement;
  }
}
