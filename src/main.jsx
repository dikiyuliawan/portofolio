import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { profile, projects, safeDestination } from './content';
import './styles.css';

const routeFromPath = () => window.location.pathname.replace(/\/$/, '') === '/works' ? 'works' : 'about';
const Arrow = ({ className = '' }) => <span aria-hidden="true" className={className}>↗</span>;
const countWord = n => n <= 20 ? ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'][n] : String(n);

function Door({ opening }) {
  return <div className={`door-scene ${opening ? 'is-opening' : ''}`} aria-hidden="true">
    <div className="door-halo" />
    <div className="door-shadow" />
    <div className="door-frame"><div className="door-interior"><i /><i /></div>
      <div className="door-leaf"><div className="door-panel" /><span className="door-knob" /></div>
    </div>
    <div className="door-step" />
  </div>;
}

function Modal({ item, onClose }) {
  const ref = useRef(null);
  const isContact = item === 'contact';
  const url = safeDestination(isContact ? profile.contactUrl : item.url);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} onClose={onClose} onClick={e => {
    if (e.target === ref.current) {
      const box = ref.current.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) ref.current.close();
    }
  }} aria-labelledby="detail-title" className="detail-dialog">
    <div className="dialog-content">
      <div className="flex items-center justify-between gap-4 mb-8">
        <span className="eyebrow">{isContact ? 'A conversation, someday' : `The collection / ${item.number}`}</span>
        <button autoFocus className="close-button" onClick={() => ref.current.close()} aria-label="Close dialog">×</button>
      </div>
      {!isContact && <img className="detail-image" src={item.image} width="480" height="560" alt="" />}
      <p className="eyebrow mb-3">{isContact ? 'Contact placeholder' : item.category}</p>
      <h2 id="detail-title" className="dialog-title">{isContact ? 'Say hello.' : item.title}</h2>
      <p className="dialog-tagline">{isContact ? 'Every good thing starts with a hello.' : item.tagline}</p>
      <p className="dialog-description">{isContact ? 'A contact destination hasn’t been added yet. This is an intentional placeholder — no email address or social profile is connected.' : item.description}</p>
      {!isContact && <p className="placeholder-note">{item.note}</p>}
      {url ? <a className="pill-link mt-7" href={url} target="_blank" rel="noopener noreferrer">{isContact ? 'Get in touch' : 'Visit project'} <Arrow /></a> : <p className="unavailable"><span aria-hidden="true">○</span> {isContact ? 'Contact link coming later' : 'Live project link not added yet'}</p>}
    </div>
  </dialog>;
}

function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null);
  const animate = index >= 4;
  const [shown, setShown] = useState(!animate || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (!animate || shown) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    let observer;
    let alive = true;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!alive || !ref.current) return;
      // Start observing only after the hidden state has painted, so the entrance
      // transition always plays — even when the card sits inside the initial viewport.
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { setShown(true); observer.disconnect(); }
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      observer.observe(ref.current);
    }));
    return () => { alive = false; cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [animate, shown]);
  return <article ref={animate ? ref : undefined} className={`project project-${project.id}${animate ? ` reveal-card ${shown ? 'is-revealed' : 'is-hidden'}` : ''}`} style={animate ? { '--reveal-delay': `${((index - 4) % 4) * 110}ms` } : undefined}>
    <button className="project-button" onClick={e => onOpen(e, project)} aria-label={`Explore ${project.title}`}>
      <div className="object-stage"><img src={project.image} alt="" width="480" height="560" loading={animate ? 'lazy' : 'eager'} decoding="async" /><span className="object-arrow" aria-hidden="true">↗</span></div>
      <div className="project-caption">
        <h2><span className="project-number">{project.number} /</span> {project.title}</h2>
        <p className="project-category">{project.category}</p>
        <span className="project-rule" aria-hidden="true" />
      </div>
    </button>
  </article>;
}

function App() {
  const [route, setRoute] = useState(routeFromPath);
  const [transitioning, setTransitioning] = useState(false);
  const [modal, setModal] = useState(null);
  const timer = useRef(null);
  const heading = useRef(null);
  const initial = useRef(true);
  const returnFocus = useRef(null);

  useEffect(() => {
    const onPop = () => {
      clearTimeout(timer.current);
      setTransitioning(false);
      setModal(null);
      setRoute(routeFromPath());
    };
    window.addEventListener('popstate', onPop);
    return () => { clearTimeout(timer.current); window.removeEventListener('popstate', onPop); };
  }, []);

  useEffect(() => {
    document.title = route === 'works' ? 'Little Worlds — The Collection' : 'Small Door — About Me';
    if (initial.current) { initial.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'instant' });
    heading.current?.focus({ preventScroll: true });
  }, [route]);

  function navigate(event, target) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (transitioning || target === route) return;
    const change = () => {
      window.history.pushState({}, '', target === 'works' ? '/works' : '/');
      setRoute(target);
      setTransitioning(false);
    };
    if (target === 'works' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTransitioning(true);
      timer.current = setTimeout(change, 1000);
    } else change();
  }

  function openModal(event, item) { returnFocus.current = event.currentTarget; setModal(item); }
  function closeModal() { setModal(null); returnFocus.current?.focus({ preventScroll: true }); }

  const isWorks = route === 'works';
  return <div className={`site-shell ${isWorks ? 'works-page' : 'about-page'} ${transitioning ? 'entering' : ''}`}>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header flex items-center justify-between gap-5">
      <a className={`wordmark ${isWorks ? 'collection-mark' : ''}`} href="/" onClick={e => navigate(e, 'about')} aria-label="About me, home">{isWorks ? 'Little Worlds' : profile.name}</a>
      <nav className="flex items-center nav-links" aria-label="Main navigation">
        {isWorks && <a href="#collection" className="collection-nav">The collection</a>}
        <a href="/" onClick={e => navigate(e, 'about')} aria-current={!isWorks ? 'page' : undefined}>{isWorks ? 'About' : 'About Me'}</a>
        <button onClick={e => openModal(e, 'contact')}>Say hello <Arrow /></button>
      </nav>
    </header>

    {isWorks ? <main id="main" tabIndex="-1" className="works-main">
      <section className="collection-intro text-center">
        <p className="eyebrow mb-5">An independent collection</p>
        <h1 ref={heading} tabIndex="-1" className="collection-title">Serious craft.<br /><span>Curious little worlds.</span></h1>
        <p className="collection-subtitle">{countWord(projects.length)}{projects.length === 1 ? ' experiment' : ' experiments'} in making everyday life a little more interesting.</p>
        <a href="#collection" className="explore-hint">Select an object to explore <span aria-hidden="true">↓</span></a>
      </section>
      <section id="collection" aria-label="Project collection" className="project-gallery">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={openModal} />)}
      </section>
      <div className="collection-end flex flex-col sm:flex-row items-center justify-between gap-5">
        <p>Small ideas. Made with intention.</p>
        <a href="/" onClick={e => navigate(e, 'about')} className="back-link"><span aria-hidden="true">←</span> Back to the person behind them</a>
      </div>
    </main> : <main id="main" tabIndex="-1" className="about-main text-center flex flex-col items-center">
      <section className="intro-copy">
        <p className="eyebrow intro-eyebrow">A person behind the projects</p>
        <h1 ref={heading} tabIndex="-1" className="about-title">Hi, I’m <span>{profile.name}.</span></h1>
        <p className="role-label">{profile.role}</p>
        <p className="personal-note">{profile.note}</p>
      </section>
      <a href="/works" className="door-link" onClick={e => navigate(e, 'works')} aria-label="Open the door to Little Worlds"><Door opening={transitioning} /></a>
      <a className="pill-link enter-link" href="/works" onClick={e => navigate(e, 'works')} aria-disabled={transitioning || undefined}>Step into my works <Arrow /></a>
      <span className="worlds-label">Little Worlds</span>
      <span className="transition-announcement sr-only" role="status">{transitioning ? 'Opening the door to Little Worlds…' : ''}</span>
    </main>}

    <footer className="site-footer flex flex-wrap items-center justify-between gap-4">
      <p>{isWorks ? 'Same curiosity. A different little world.' : 'A person behind the projects.'}</p>
      <div className="footer-nav flex items-center gap-3"><a href="/" onClick={e => navigate(e, 'about')} aria-current={!isWorks ? 'page' : undefined}>About Me</a><span aria-hidden="true">/</span><a href="/works" onClick={e => navigate(e, 'works')} aria-current={isWorks ? 'page' : undefined}>Works</a></div>
    </footer>
    {transitioning && <div className="transition-veil" aria-hidden="true" />}
    {modal && <Modal item={modal} onClose={closeModal} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
