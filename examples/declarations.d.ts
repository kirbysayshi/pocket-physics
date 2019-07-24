declare module 'science-halt' {
  function scienceHalt (onhalt: () => void, opt_msg?: string, opt_keycode?: number): void;
  export = scienceHalt;
}