export function SiteHeader() {
  return <header className="fixed top-0 z-50 flex w-full items-center justify-between px-5 py-4 md:px-8" style={{ background:"rgba(249,247,237,.86)", backdropFilter:"blur(10px)" }}>
    <a href="#top" className="no-underline text-[#ee3729]"><span className="display text-2xl tracking-[-.12em] leading-[.72]">dhoklu</span></a>
    <nav className="desktop-nav flex items-center gap-10"><a className="nav-link" href="#about">about</a><a className="nav-link" href="#work">bits & bobs</a><a className="nav-link" href="#events">workshops</a><a className="nav-link" href="#contact">say hello</a></nav>
    <a href="#events" className="outline-cta text-xs no-underline">find a workshop</a>
  </header>;
}
