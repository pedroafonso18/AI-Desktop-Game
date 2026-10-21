/* CRACK'D - the WebCruiser 98 browser: pages, sites, the forum, downloads. */
window.BrowserApp = (function () {
  const Pix = window.Pix;
  const C = Pix.C;
  const Data = window.Data;
  const Art = window.Art;

  const TOOL_H = 26;
  const STATUS_H = 10;

  /* ---------------- page helpers ---------------- */

  function P(type, o) {
    o = o || {};
    o.type = type;
    o.scroll = 0;
    o.contentH = 0;
    return o;
  }

  function starBar(ctx, x, y, score, max) {
    const filled = Math.round((score / (max || 5)) * 5);
    for (let i = 0; i < 5; i++) {
      Pix.text(ctx, i < filled ? '*' : '.', x + i * 5, y, { color: i < filled ? '#ffc94d' : '#4a4f6b' });
    }
  }

  function adsBanner(ctx, x, y, w, h, t, label) {
    Pix.rect(ctx, x, y, w, h, '#2a0f3a');
    Pix.frame(ctx, x, y, w, h, '#ff7eb6');
    const blink = Math.floor(t / 350) % 2 === 0;
    Pix.text(ctx, label || 'YOU ARE THE 1,000,000th VISITOR!!', x + 4, y + 3, { color: blink ? '#ffe14d' : '#ff7eb6' });
    Pix.text(ctx, 'CLICK FOR A FREE IPHONE 12 PRO MAX', x + 4, y + 13, { color: '#e9e7e2' });
    Pix.text(ctx, '*** no virus, just ads, we promise ***', x + 4, y + 22, { color: '#8b86a0' });
  }
  /* ---------------- pages ---------------- */

  const Pages = {};

  Pages.home = function () {
    const p = P('home');
    p.contentH = 260;
    p.draw = function (ctx, r, t) {
      // header
      Pix.vgrad(ctx, 0, 0, r.w, 42, [[0, '#2b3f8f'], [1, '#16204a']]);
      Pix.rect(ctx, 0, 42, r.w, 1, '#000');
      Pix.bigText(ctx, 'COOLWEB 2003', 8, 6, { scale: 2, color: '#ffe14d' });
      Pix.text(ctx, 'the finest web since 1999', 8, 28, { color: '#9fb0ff' });
      const flash = Math.floor(t / 400) % 2 === 0;
      Pix.text(ctx, flash ? '[ NEW ] 12 new MIDI files!!' : '       12 new MIDI files!!', r.w - 8, 8, { color: '#68dd72', align: 'right' });
      Pix.text(ctx, 'best viewed at 800x600', r.w - 8, 28, { color: '#7f88b8', align: 'right' });

      // left column links
      const links = [
        { label: '>> Is this site safe? (forum)', go: 'forum' },
        { label: '>> PIXEL KNIGHT 3000 - free!!', go: 'site:vault' },
        { label: '>> SiteJabber: download site reviews', go: 'jabber' },
        { label: '>> Safe-Site Checker (beta)', go: 'checker' },
        { label: '>> Free ringtones for your phone', go: 'about' },
        { label: '>> Wallpapers (pixel knights)', go: 'about' },
        { label: '>> WE BUY YOUR OLD GAMES', go: 'about' },
      ];
      let y = 52;
      for (const l of links) {
        Pix.text(ctx, l.label, 10, y, { color: '#63b3ff' });
        Pix.text(ctx, l._hover ? '>' : '', 10, y, { color: '#ffe14d' });
        y += 13;
      }
      p._links = links.map((l, i) => ({ ...l, y: 52 + i * 13, h: 11 }));

      // right column
      adsBanner(ctx, r.w - 190, 50, 182, 32, t);
      Pix.rect(ctx, r.w - 190, 88, 182, 1, '#000');
      Pix.text(ctx, 'HOT TODAY', r.w - 186, 94, { color: '#ffc94d', font: Pix.FONT.bold });
      const hot = [
        '1. a cat in a box .gif',
        '2. FREE ANTIVIRUS DOWNLOAD',
        '3. how to make your gf cry',
        '4. TOP 10 CRACKS OF THE WEEK',
        '5. naked pictures of the internet',
      ];
      hot.forEach((h, i) => Pix.text(ctx, h, r.w - 186, 106 + i * 10, { color: '#63b3ff' }));
      Pix.text(ctx, 'Visitors today: 000412', r.w - 186, 162, { color: '#6a655e' });
      Pix.rect(ctx, r.w - 190, 176, 182, 46, '#1a1d33');
      Pix.frame(ctx, r.w - 190, 176, 182, 46, '#39405e');
      Pix.text(ctx, 'COOLWEB CHAT', r.w - 186, 180, { color: '#68dd72', font: Pix.FONT.bold });
      Pix.text(ctx, '> hey does anyone know a good', r.w - 186, 192, { color: '#cfcbd8' });
      Pix.text(ctx, '> site to download from', r.w - 186, 202, { color: '#cfcbd8' });
      Pix.text(ctx, '> [guest] check the forum lol', r.w - 186, 212, { color: '#68dd72' });
    };
    p.click = function (rx, ry, win) {
      if (p._links) {
        for (const l of p._links) {
          if (ry >= l.y - 2 && ry < l.y + l.h + 2 && rx > 4 && rx < 210) {
            window.Sfx.click();
            window.GAME.browser.go(win, l.go);
            return;
          }
        }
      }
    };
    p.clickAd = function (rx, ry, win) {
      if (rx >= 290 && rx <= 472 && ry >= 50 && ry <= 82) {
        window.Sfx.click();
        window.GAME.browser.go(win, 'ad');
      }
    };
    return p;
  };

  Pages.forum = function () {
    const p = P('forum');
    const F = Data.FORUM;
    p.replies = F.replies;
    p.contentH = 400;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, 18, '#1b2038');
      Pix.text(ctx, F.board, 6, 2, { color: '#7f88b8' });
      Pix.text(ctx, 'Thread:', r.w - 6, 2, { color: '#7f88b8', align: 'right' });
      Pix.text(ctx, F.title, 6, 10, { color: '#ffc94d', font: Pix.FONT.bold });
      Pix.rect(ctx, 0, 19, r.w, 1, '#39405e');

      let y = 24;
      for (const rep of p.replies) {
        const seen = window.GAME.state.seenReplies[rep.user];
        const bg = rep.op ? '#2a2140' : (rep.mod ? '#232b3f' : '#1d2136');
        Pix.rect(ctx, 4, y, r.w - 8, 1, '#39405e');
        const lines = Pix.wrap(ctx, rep.text, r.w - 40);
        const linkH = rep.link || rep.ad ? 11 : 0;
        const h = 12 + lines.length * 9 + linkH + 5;
        Pix.rect(ctx, 4, y + 1, r.w - 8, h, bg);
        p['_r_' + rep.user] = { y, h };
        // reading progress: anything that has been on screen counts as read
        if (y < window.GAME.browser.visibleH && y + h > 0) {
          window.GAME.state.seenReplies[rep.user] = true;
        }
        // author
        Pix.text(ctx, rep.user, 8, y + 4, { color: rep.mod ? '#ff7eb6' : rep.op ? '#ffc94d' : '#63b3ff', font: Pix.FONT.bold });
        Pix.text(ctx, rep.time, 90, y + 4, { color: '#6a655e' });
        Pix.text(ctx, (rep.votes > 0 ? '+' + rep.votes : '0'), r.w - 12, y + 4, { color: '#68dd72', align: 'right' });
        // body
        let ty = y + 14;
        for (const ln of lines) {
          if (rep.truth && ln.includes(Data.GOOD_HASH)) {
            // draw the hash specially and make it clickable
            const idx = ln.indexOf(Data.GOOD_HASH);
            const pre = ln.slice(0, idx);
            const wPre = Pix.text(ctx, pre, 8, ty, { color: '#e9e7e2' });
            const wHash = Pix.text(ctx, Data.GOOD_HASH, 8 + wPre, ty, { color: seen ? '#68dd72' : '#ffe14d' });
            Pix.rect(ctx, 8 + wPre, ty + 8, wHash, 1, seen ? '#68dd72' : '#ffe14d');
            p._hashRect = { x: 8 + wPre, y: ty, w: wHash, h: 9 };
          } else {
            Pix.text(ctx, ln, 8, ty, { color: '#e9e7e2' });
          }
          ty += 9;
        }
        if (rep.link) {
          const site = Data.SITES.find((s) => s.id === rep.link);
          Pix.panel(ctx, 8, ty, Math.min(230, 60 + site.name.length * 4), 10, '#2f3550', '#5a6088', '#12142a');
          Pix.text(ctx, '>> open ' + site.name, 12, ty + 1, { color: '#63b3ff' });
          p['_link_' + rep.user] = { x: 8, y: ty, w: Math.min(230, 60 + site.name.length * 4), h: 10 };
        }
        if (rep.ad) {
          Pix.text(ctx, '>> CLICK HERE FOR FREE PRIZES', 8, ty, { color: '#ff7eb6' });
          p['_ad_' + rep.user] = { x: 8, y: ty, w: 160, h: 10 };
        }
        y += h + 2;
        p.contentH = y + 10;
      }
      Pix.text(ctx, '1-' + p.replies.length + ' of ' + p.replies.length + ' replies', r.w / 2, p.contentH, { color: '#6a655e', align: 'center' });
    };
    p.click = function (rx, ry, win) {
      // hash click
      if (p._hashRect && rx >= p._hashRect.x && rx <= p._hashRect.x + p._hashRect.w && ry >= p._hashRect.y && ry <= p._hashRect.y + p._hashRect.h) {
        window.GAME.copyHash(Data.GOOD_HASH);
        return;
      }
      for (const rep of p.replies) {
        const k = '_link_' + rep.user;
        const adK = '_ad_' + rep.user;
        if (p[k] && rx >= p[k].x && rx <= p[k].x + p[k].w && ry >= p[k].y && ry <= p[k].y + p[k].h) {
          window.Sfx.click();
          window.GAME.browser.go(win, 'site:' + rep.link);
          return;
        }
        if (p[adK] && rx >= p[adK].x && rx <= p[adK].x + p[adK].w && ry >= p[adK].y && ry <= p[adK].y + p[adK].h) {
          window.Sfx.click();
          window.GAME.browser.go(win, 'ad');
          return;
        }
      }
    };
    p.seen = function (rx, ry) {
      // mark replies as read as they scroll past
      window.GAME.state.seenReplies['__'] = true;
    };
    return p;
  };

  Pages.site = function (siteId) {
    const site = Data.SITES.find((s) => s.id === siteId);
    const p = P('site', { site });
    p.contentH = 330;
    p.draw = function (ctx, r, t) {
      const style = site.style;
      const acc = site.accent;
      let bg = '#e8e6e0';
      let fg = '#1a1a1a';
      let link = '#0000ee';
      if (style === 'modern') { bg = '#0b1f12'; fg = '#dff5e4'; link = '#68dd72'; }
      else if (style === 'ugly') { bg = '#ffffff'; fg = '#000000'; link = '#0000ee'; }
      else if (style === 'forum') { bg = '#0b1b33'; fg = '#d5e4ff'; link = '#63b3ff'; }
      else if (style === 'loud') { bg = '#2b0620'; fg = '#ffe1f2'; link = '#ff7eb6'; }
      else if (style === 'br') { bg = '#06210f'; fg = '#e2ffee'; link = '#68dd72'; }
      else { bg = '#141824'; fg = '#d5d8e6'; link = '#63b3ff'; }
      Pix.rect(ctx, 0, 0, r.w, r.h + 400, bg);

      // header
      Pix.rect(ctx, 0, 0, r.w, 28, acc);
      Pix.rect(ctx, 0, 28, r.w, 1, '#000');
      Pix.bigText(ctx, site.name, 6, 4, { scale: 1, color: '#0d0f1a' });
      Pix.text(ctx, site.tagline, 8, 17, { color: '#0d0f1a' });
      // nav
      Pix.rect(ctx, 0, 29, r.w, 11, style === 'ugly' ? '#c0c0c0' : '#1a1f33');
      const nav = ['HOME', 'GAMES', 'FORUMS', 'LINKS', 'CONTACT'];
      nav.forEach((n, i) => {
        Pix.text(ctx, n, 6 + i * 46, 31, { color: style === 'ugly' ? '#0000ee' : '#9fb0ff' });
      });

      let y = 43;
      // badge
      Pix.panel(ctx, 6, y, 180, 13, style === 'ugly' ? '#e0e0e0' : '#1d2740', style === 'ugly' ? '#ffffff' : '#4a5a80', '#101420');
      Pix.text(ctx, site.badge, 10, y + 2, { color: style === 'ugly' ? '#006600' : '#68dd72' });
      Pix.text(ctx, site.badgeNote || '', 192, y + 2, { color: style === 'ugly' ? '#888888' : '#6a655e' });
      y += 17;

      // ad
      adsBanner(ctx, 6, y, r.w - 12, 30, t, style === 'br' ? 'VOCE GANHOU UM IPHONE!!' : 'YOU ARE THE 1,000,000th VISITOR!!');
      p._adRect = { x: 6, y, w: r.w - 12, h: 30 };
      y += 34;

      // download options (right up top, like every real download site)
      Pix.text(ctx, 'DOWNLOAD OPTIONS', 6, y, { color: link, font: Pix.FONT.bold });
      y += 11;
      site.links.forEach((lnk) => {
        Pix.panel(ctx, 6, y, 150, 16, style === 'ugly' ? '#c8c8c8' : acc, '#ffffff', '#101420');
        Pix.text(ctx, lnk.label, 12, y + 4, { color: style === 'ugly' ? '#000080' : '#0d0f1a' });
        p['_dl_' + lnk.id] = { x: 6, y, w: 150, h: 16 };
        Pix.text(ctx, lnk.size + '   ' + lnk.speed + (lnk.sponsored ? '   SPONSORED' : ''), 162, y + 1, { color: fg });
        Pix.text(ctx, 'md5: ' + lnk.md5, 162, y + 10, { color: style === 'ugly' ? '#666666' : '#5d6484' });
        Pix.panel(ctx, 6, y + 18, 64, 10, '#2f3550', '#5a6088', '#12142a');
        Pix.text(ctx, 'VERIFY MD5', 10, y + 19, { color: '#cfcbd8' });
        p['_vf_' + lnk.id] = { x: 6, y: y + 18, w: 64, h: 10 };
        const st = window.GAME.state.verify[lnk.id];
        if (st) {
          Pix.text(ctx, st, 74, y + 19, { color: st.startsWith('MATCH') ? '#68dd72' : '#ff5f56' });
        }
        y += 32;
      });
      y += 2;

      // game card
      Pix.rect(ctx, 6, y, r.w - 12, 46, style === 'ugly' ? '#f0f0f0' : '#1b2236');
      Pix.frame(ctx, 6, y, r.w - 12, 46, style === 'ugly' ? '#808080' : '#39405e');
      Art.draw(ctx, Art.ICONS.game, 12, y + 4, false);
      Pix.text(ctx, 'PIXEL KNIGHT 3000', 34, y + 6, { color: style === 'ugly' ? '#000080' : '#ffc94d', font: Pix.FONT.bold });
      Pix.text(ctx, 'CRACKED / PATCHED / KEYGEN INCLUDED', 34, y + 17, { color: link });
      Pix.text(ctx, 'file: PixelKnight3000_CRACKED.exe   size: 2.1 GB   seeders: 12', 34, y + 28, { color: fg });
      Pix.text(ctx, 'rating: 9.4/10 "great game, great download" - 1,204 reviews', 34, y + 37, { color: style === 'ugly' ? '#666666' : '#6a655e' });
      y += 50;

      // comments
      Pix.rect(ctx, 0, y, r.w, 1, style === 'ugly' ? '#c0c0c0' : '#39405e');
      y += 4;
      Pix.text(ctx, 'COMMENTS (' + site.comments.length + ')', 6, y, { color: link, font: Pix.FONT.bold });
      y += 11;
      for (const cm of site.comments) {
        Pix.text(ctx, cm.u, 8, y, { color: '#ffc94d' });
        Pix.text(ctx, cm.t, 60, y, { color: fg });
        y += 10;
      }
      y += 4;
      Pix.text(ctx, '© 2003 ' + site.name + '. All rights reserved. None of them.', 6, y, { color: style === 'ugly' ? '#888888' : '#4a4f6b' });
      p.contentH = y + 20;
    };
    p.click = function (rx, ry, win) {
      if (p._adRect && rx >= p._adRect.x && rx <= p._adRect.x + p._adRect.w && ry >= p._adRect.y && ry <= p._adRect.y + p._adRect.h) {
        window.Sfx.click();
        window.GAME.browser.go(win, 'ad');
        return;
      }
      for (const lnk of site.links) {
        const d = p['_dl_' + lnk.id];
        const v = p['_vf_' + lnk.id];
        if (d && rx >= d.x && rx <= d.x + d.w && ry >= d.y && ry <= d.y + d.h) {
          window.Sfx.click();
          window.GAME.startDownload(win, site, lnk);
          return;
        }
        if (v && rx >= v.x && rx <= v.x + v.w && ry >= v.y && ry <= v.y + v.h) {
          window.Sfx.click();
          window.GAME.verifyHash(lnk);
          return;
        }
      }
    };
    return p;
  };

  Pages.jabber = function () {
    const p = P('jabber');
    p.contentH = 240;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, r.h + 200, '#141824');
      Pix.bigText(ctx, 'SITEJABBER', 8, 6, { scale: 2, color: '#63b3ff' });
      Pix.text(ctx, 'real reviews from real victims', 8, 28, { color: '#7f88b8' });
      Pix.rect(ctx, 0, 40, r.w, 1, '#39405e');
      let y = 48;
      for (const rev of Data.SITEJABBER.reviews) {
        const site = Data.SITES.find((s) => s.id === rev.site);
        Pix.rect(ctx, 6, y, r.w - 12, 44, '#1b2036');
        Pix.frame(ctx, 6, y, r.w - 12, 44, '#39405e');
        Pix.text(ctx, site.name, 12, y + 5, { color: '#ffc94d', font: Pix.FONT.bold });
        starBar(ctx, 12, y + 16, rev.score, 5);
        Pix.text(ctx, rev.score.toFixed(1) + ' / 5', 40, y + 16, { color: '#cfcbd8' });
        Pix.text(ctx, '(' + rev.count + ' reviews)', 80, y + 16, { color: '#6a655e' });
        if (rev.verified) Pix.text(ctx, '[verified purchase]', 12, y + 26, { color: '#68dd72' });
        if (rev.paid) Pix.text(ctx, '[sponsored]', 110, y + 26, { color: '#ff7eb6' });
        Pix.text(ctx, '"' + rev.quote + '"', 12, y + 34, { color: '#e9e7e2' });
        Pix.text(ctx, '- ' + rev.by, r.w - 16, y + 34, { color: '#6a655e', align: 'right' });
        y += 48;
      }
      Pix.text(ctx, 'reviews are never bought. (some are bought)', 8, y + 4, { color: '#6a655e' });
      p.contentH = y + 20;
    };
    p.click = function () {};
    return p;
  };

  Pages.checker = function () {
    const p = P('checker');
    p.contentH = 200;
    p.value = '';
    p.result = null;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, r.h + 150, '#0d1424');
      Pix.bigText(ctx, 'SAFE-SITE CHECKER', 8, 6, { scale: 2, color: '#68dd72' });
      Pix.text(ctx, 'paste a download link and we will tell you if it is safe', 8, 28, { color: '#9fb0ff' });
      Pix.text(ctx, 'paste the site address here:', 8, 48, { color: '#cfcbd8' });
      Pix.inset(ctx, 8, 58, 260, 12, '#0a0f1c', '#2a3350', '#48507a');
      const shown = p.value || '';
      Pix.text(ctx, shown.slice(-38), 12, 60, { color: '#e9e7e2' });
      if (Math.floor(t / 400) % 2 === 0 && p.focused) {
        Pix.rect(ctx, 12 + Pix.measure(ctx, shown.slice(-38)), 60, 1, 8, '#e9e7e2');
      }
      Pix.panel(ctx, 274, 58, 44, 12, '#2f3550', '#5a6088', '#12142a');
      Pix.text(ctx, 'CHECK', 283, 60, { color: '#e9e7e2' });
      p._btn = { x: 274, y: 58, w: 44, h: 12 };
      if (p.result) {
        Pix.rect(ctx, 8, 80, r.w - 16, 40, '#141c2e');
        Pix.frame(ctx, 8, 80, r.w - 16, 40, '#39405e');
        Pix.text(ctx, p.result.title, 14, 86, { color: p.result.color, font: Pix.FONT.bold });
        Pix.text(ctx, p.result.body, 14, 98, { color: '#cfcbd8' });
        Pix.text(ctx, 'scanned ' + p.result.votes + ' user reports   last updated: 2004', 14, 110, { color: '#6a655e' });
      }
      Pix.text(ctx, 'Our scanner checks 2 URLs a day. It is a beta. Please do not sue us.', 8, 130, { color: '#6a655e' });
      Pix.text(ctx, 'Verdicts are provided by real users and one advertiser.', 8, 142, { color: '#6a655e' });
      p.contentH = 170;
    };
    p.click = function (rx, ry, win) {
      if (p._btn && rx >= p._btn.x && rx <= p._btn.x + p._btn.w && ry >= p._btn.y && ry <= p._btn.y + p._btn.h) {
        window.Sfx.click();
        p.result = window.GAME.checkSite(p.value);
        window.GAME.advanceTime(3);
        return;
      }
      if (rx >= 8 && rx <= 268 && ry >= 58 && ry <= 70) {
        p.focused = true;
        window.Sfx.click();
      }
    };
    return p;
  };

  Pages.about = function () {
    const p = P('about');
    p.contentH = 140;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, r.h + 100, '#c8c4b8');
      Pix.rect(ctx, 0, 0, r.w, 40, '#2b3f8f');
      Pix.bigText(ctx, 'WEBCRUISER 98', 8, 6, { scale: 2, color: '#ffe14d' });
      Pix.text(ctx, 'Version 4.2.0 (build 20031107)', 8, 28, { color: '#9fb0ff' });
      const lines = [
        'Thanks for using WebCruiser 98!',
        '',
        'This browser can browse. It can also download, which is a',
        'feature, and play midi files, which was a mistake.',
        '',
        'We do not host any of the files you may be looking for.',
        'We have never hosted a virus. (We have hosted a virus.)',
        '',
        'STATUS: online (barely)',
      ];
      lines.forEach((l, i) => Pix.text(ctx, l, 8, 50 + i * 10, { color: '#1a1a1a' }));
    };
    p.click = function () {};
    return p;
  };

  Pages.ad = function () {
    const p = P('ad');
    p.contentH = 220;
    p.stage = 0;
    p.name = ''; p.card = ''; p.cpf = '';
    p.draw = function (ctx, r, t) {
      const flash = Math.floor(t / 250) % 2 === 0;
      Pix.rect(ctx, 0, 0, r.w, r.h + 160, flash ? '#3a0a4a' : '#5c0a2a');
      for (let i = 0; i < 30; i++) {
        const x = (i * 97 + Math.floor(t / 20)) % r.w;
        Pix.text(ctx, 'FREE!!!', x, (i * 53) % 180, { color: i % 2 ? '#ffe14d' : '#ff7eb6' });
      }
      Pix.bigText(ctx, 'CONGRATULATIONS!!', 8, 6, { scale: 2, color: '#ffe14d' });
      Pix.text(ctx, 'You are the winner of a FREE IPHONE 12 PRO MAX!', 10, 32, { color: '#fff' });
      Pix.text(ctx, 'Just fill in this tiny form to claim your prize.', 10, 44, { color: '#ffd0e8' });
      if (p.stage === 0) {
        const fields = [
          { label: 'full name', v: p.name, key: 'name' },
          { label: 'card number', v: p.card, key: 'card' },
          { label: 'CPF (for the tax)', v: p.cpf, key: 'cpf' },
        ];
        fields.forEach((f, i) => {
          const y = 62 + i * 18;
          Pix.text(ctx, f.label, 12, y, { color: '#fff' });
          Pix.inset(ctx, 100, y - 2, 160, 12, '#1a0a20', '#5a1a5a', '#8a2a6a');
          Pix.text(ctx, f.v, 104, y, { color: '#fff' });
          p['_f_' + f.key] = { x: 100, y: y - 2, w: 160, h: 12 };
        });
        Pix.panel(ctx, 12, 118, 100, 14, '#3a7a2a', '#68dd72', '#14300c');
        Pix.text(ctx, 'CLAIM MY PRIZE', 24, 121, { color: '#ffffff', font: Pix.FONT.bold });
        p._claim = { x: 12, y: 118, w: 100, h: 14 };
        Pix.text(ctx, 'no thanks', 140, 121, { color: '#9fb0ff' });
        p._no = { x: 140, y: 118, w: 60, h: 14 };
        Pix.text(ctx, '* no viruses, no tracking, no selling your data to anyone', 12, 140, { color: '#c9a0c8' });
      } else {
        Pix.text(ctx, 'processing your prize... please wait', 12, 70, { color: '#fff' });
        for (let i = 0; i < 8; i++) Pix.text(ctx, '.', 130 + i * 5, 70, { color: '#ffe14d' });
      }
      p.contentH = 170;
    };
    p.click = function (rx, ry, win) {
      if (p.stage === 1) return;
      if (p._claim && rx >= p._claim.x && rx <= p._claim.x + p._claim.w && ry >= p._claim.y && ry <= p._claim.y + p._claim.h) {
        window.Sfx.click();
        p.stage = 1;
        window.GAME.advanceTime(5);
        setTimeout(() => window.GAME.endGame('scam'), 900);
        return;
      }
      if (p._no && rx >= p._no.x && rx <= p._no.x + p._no.w && ry >= p._no.y && ry <= p._no.y + p._no.h) {
        window.Sfx.click();
        window.GAME.browser.back(win);
        return;
      }
      for (const k of ['name', 'card', 'cpf']) {
        const f = p['_f_' + k];
        if (f && rx >= f.x && rx <= f.x + f.w && ry >= f.y && ry <= f.y + f.h) {
          p.focusField = k;
          window.Sfx.click();
        }
      }
    };
    return p;
  };

  Pages.download = function (site, link) {
    const p = P('download', { site, link });
    p.progress = 0;
    p.done = false;
    p.total = site ? link.size : '2.1 GB';
    p.speed = link ? link.speed : 'DSL';
    p.contentH = 120;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, r.h + 80, '#0f1424');
      Pix.text(ctx, 'DOWNLOADING...', 10, 8, { color: '#68dd72', font: Pix.FONT.bold });
      const name = 'PixelKnight3000_CRACKED.exe';
      Pix.text(ctx, name, 10, 24, { color: '#e9e7e2' });
      Pix.text(ctx, 'from ' + (site ? site.name : '?'), 10, 35, { color: '#7f88b8' });
      // progress
      const bw = r.w - 20;
      Pix.inset(ctx, 10, 50, bw, 14, '#0a0f1c', '#2a3350', '#48507a');
      const fw = Math.round((bw - 2) * p.progress);
      Pix.rect(ctx, 11, 51, fw, 12, '#2f7fd4');
      Pix.rect(ctx, 11, 51, fw, 2, '#63b3ff');
      Pix.text(ctx, Math.round(p.progress * 100) + '%', 10, 68, { color: '#e9e7e2' });
      const kbs = p.speed === '56k' ? 7 : p.speed === 'FAST' || p.speed === 'LIGHTSPEED' ? 640 : 96;
      Pix.text(ctx, kbs + ' kbps   ' + p.speed, 60, 68, { color: '#7f88b8' });
      Pix.text(ctx, 'connection: ' + (p.speed === '56k' ? '56k modem (you can hear it)' : 'broadband'), r.w - 10, 68, { color: '#7f88b8', align: 'right' });
      if (p.done) {
        Pix.rect(ctx, 10, 84, r.w - 20, 30, '#16321f');
        Pix.frame(ctx, 10, 84, r.w - 20, 30, '#68dd72');
        Pix.text(ctx, 'Download complete.', 16, 90, { color: '#68dd72', font: Pix.FONT.bold });
        Pix.text(ctx, 'Open the file, or save it to your Downloads folder?', 16, 102, { color: '#e9e7e2' });
        Pix.panel(ctx, 16, 112, 60, 12, '#2f3550', '#5a6088', '#12142a');
        Pix.text(ctx, 'OPEN', 30, 114, { color: '#e9e7e2' });
        p._open = { x: 16, y: 112, w: 60, h: 12 };
        Pix.panel(ctx, 82, 112, 84, 12, '#2f3550', '#5a6088', '#12142a');
        Pix.text(ctx, 'SAVE TO FOLDER', 88, 114, { color: '#e9e7e2' });
        p._save = { x: 82, y: 112, w: 84, h: 12 };
        Pix.panel(ctx, 300, 112, 60, 12, '#5a2020', '#a04040', '#201010');
        Pix.text(ctx, 'DELETE', 314, 114, { color: '#ff9d9d' });
        p._del = { x: 300, y: 112, w: 60, h: 12 };
      } else {
        Pix.text(ctx, 'do not close this window (do not close this window)', 10, 88, { color: '#6a655e' });
      }
      p.contentH = 130;
    };
    p.click = function (rx, ry, win) {
      if (!p.done) return;
      if (p._open && rx >= p._open.x && rx <= p._open.x + p._open.w && ry >= p._open.y && ry <= p._open.y + p._open.h) {
        window.Sfx.click();
        window.GAME.openInstaller(p.site, p.link);
        return;
      }
      if (p._save && rx >= p._save.x && rx <= p._save.x + p._save.w && ry >= p._save.y && ry <= p._save.y + p._save.h) {
        window.Sfx.click();
        window.GAME.saveToFolder(p.site, p.link);
        return;
      }
      if (p._del && rx >= p._del.x && rx <= p._del.x + p._del.w && ry >= p._del.y && ry <= p._del.y + p._del.h) {
        window.Sfx.click();
        window.Sfx.error();
        window.GAME.toast('Deleted. Deleted files still infect. But ok.');
        p.done = false;
        p.progress = 0;
      }
    };
    p.update = function (win, dt, t) {
      if (p.done) return;
      const rate = p.speed === '56k' ? 0.055 : p.speed === 'FAST' || p.speed === 'LIGHTSPEED' ? 0.15 : 0.09;
      p.progress = Math.min(1, p.progress + dt * rate);
      if (p.progress >= 1 && !p.done) {
        p.done = true;
        window.Sfx.modemStop();
        window.Sfx.win();
        window.GAME.downloadFinished(p.site, p.link);
      }
    };
    return p;
  };

  /* ---------------- download gates ---------------- */

  Pages.survey = function (siteId, linkId) {
    const site = Data.SITES.find((s) => s.id === siteId);
    const link = site && site.links.find((l) => l.id === linkId);
    const p = P('survey', { site, link });
    p.answers = [null, null, null];
    p.contentH = 190;
    p.draw = function (ctx, r, t) {
      Pix.rect(ctx, 0, 0, r.w, r.h + 140, '#e8e6e0');
      Pix.rect(ctx, 0, 0, r.w, 30, '#c0392b');
      Pix.bigText(ctx, 'ONE MOMENT', 8, 6, { scale: 1, color: '#ffffff' });
      Pix.text(ctx, 'survey to continue to the download', 8, 20, { color: '#ffe0dd' });
      const qs = [
        ['What is your favourite colour?', ['blue', 'red', 'green', 'black']],
        ['Do you like video games?', ['yes', 'no', 'no comment']],
        ['How often do you visit download sites?', ['daily', 'weekly', 'never (why are you here)']],
      ];
      let y = 38;
      qs.forEach((q, qi) => {
        Pix.text(ctx, (qi + 1) + '. ' + q[0], 14, y, { color: '#1a1a1a', font: Pix.FONT.bold });
        y += 12;
        q[1].forEach((opt, oi) => {
          const sel = p.answers[qi] === oi;
          Pix.text(ctx, (sel ? '(o)' : '( )') + ' ' + opt, 22, y, { color: sel ? '#0a5a2a' : '#555' });
          p['_q' + qi + '_' + oi] = { x: 20, y: y - 1, w: 200, h: 11 };
          y += 11;
        });
        y += 4;
      });
      const ready = p.answers.every((a) => a !== null);
      Pix.panel(ctx, 14, y + 6, 90, 14, ready ? '#2f6f4e' : '#b0b0b0', '#ffffff', '#606060');
      Pix.text(ctx, 'SUBMIT SURVEY', 22, y + 9, { color: ready ? '#ffffff' : '#888' });
      p._submit = { x: 14, y: y + 6, w: 90, h: 14 };
      Pix.text(ctx, 'this survey helps us serve you better ads', 14, y + 26, { color: '#8a8781' });
      Pix.text(ctx, 'it also tells the advertiser your email', 14, y + 36, { color: '#8a8781' });
      p.contentH = y + 60;
    };
    p.click = function (rx, ry, win) {
      for (let qi = 0; qi < 3; qi++) {
        for (let oi = 0; oi < 4; oi++) {
          const b = p['_q' + qi + '_' + oi];
          if (b && rx >= b.x && rx <= b.x + b.w && ry >= b.y && ry <= b.y + b.h) {
            p.answers[qi] = oi;
            window.Sfx.click();
            return;
          }
        }
      }
      if (p._submit && rx >= p._submit.x && rx <= p._submit.x + p._submit.w && ry >= p._submit.y && ry <= p._submit.y + p._submit.h) {
        if (!p.answers.every((a) => a !== null)) { window.Sfx.deny(); return; }
        window.Sfx.click();
        window.GAME.advanceTime(12);
        window.GAME.reallyDownload(win, p.site, p.link);
      }
    };
    return p;
  };

  Pages.member = function (siteId, linkId) {
    const site = Data.SITES.find((s) => s.id === siteId);
    const link = site && site.links.find((l) => l.id === linkId);
    const p = P('member', { site, link });
    p.email = '';
    p.pass = '';
    p.contentH = 190;
    p.draw = function (ctx, r, t) {
      Pix.vgrad(ctx, 0, 0, r.w, 34, [[0, '#5a0a3a'], [1, '#2a0520']]);
      Pix.bigText(ctx, 'VIP MEMBERS ARE CLEAN', 8, 6, { scale: 1, color: '#ffe14d' });
      Pix.text(ctx, 'create a free account to unlock the VIP link', 8, 22, { color: '#ffc0e8' });
      Pix.rect(ctx, 0, 34, r.w, r.h + 120, '#1a0a18');
      Pix.text(ctx, 'e-mail:', 20, 50, { color: '#e9e7e2' });
      Pix.inset(ctx, 80, 46, 220, 13, '#0f0610', '#6a2050', '#a03070');
      Pix.text(ctx, p.email, 84, 48, { color: '#fff' });
      p._email = { x: 80, y: 46, w: 220, h: 13 };
      Pix.text(ctx, 'password:', 20, 72, { color: '#e9e7e2' });
      Pix.inset(ctx, 80, 68, 220, 13, '#0f0610', '#6a2050', '#a03070');
      Pix.text(ctx, '*'.repeat(p.pass.length), 84, 70, { color: '#fff' });
      p._pass = { x: 80, y: 68, w: 220, h: 13 };
      Pix.text(ctx, '[x] I am over 18 and I accept the terms', 20, 92, { color: '#cfcbd8' });
      Pix.text(ctx, '(terms: we may sell your data to the highest bidder)', 20, 104, { color: '#8a7a92' });
      Pix.panel(ctx, 20, 118, 120, 14, '#7a1040', '#ff7eb6', '#200818');
      Pix.text(ctx, 'CREATE FREE ACCOUNT', 28, 121, { color: '#ffffff' });
      p._go = { x: 20, y: 118, w: 120, h: 14 };
      Pix.text(ctx, 'your account helps us keep the site free (for them)', 20, 142, { color: '#8a7a92' });
      Pix.text(ctx, 'and free for the guy who uploaded the exe (for him)', 20, 152, { color: '#8a7a92' });
      p.contentH = 180;
    };
    p.click = function (rx, ry, win) {
      const hit = (b) => b && rx >= b.x && rx <= b.x + b.w && ry >= b.y && ry <= b.y + b.h;
      if (hit(p._email)) { p.focusField = 'email'; window.Sfx.click(); return; }
      if (hit(p._pass)) { p.focusField = 'pass'; window.Sfx.click(); return; }
      if (hit(p._go)) {
        if (!p.email || !p.pass) { window.Sfx.deny(); window.GAME.toast('Fill in the form. The virus is waiting.'); return; }
        window.Sfx.click();
        window.GAME.advanceTime(8);
        window.GAME.reallyDownload(win, p.site, p.link);
      }
    };
    return p;
  };

  Pages.vpn = function (siteId, linkId) {
    const site = Data.SITES.find((s) => s.id === siteId);
    const link = site && site.links.find((l) => l.id === linkId);
    const p = P('vpn', { site, link });
    p.stage = 0;
    p.contentH = 190;
    p.draw = function (ctx, r, t) {
      Pix.vgrad(ctx, 0, 0, r.w, r.h + 140, [[0, '#0b1b33'], [1, '#06101f']]);
      Pix.bigText(ctx, 'ALL-SECURE VPN', 8, 6, { scale: 1, color: '#63b3ff' });
      Pix.text(ctx, 'to download from this server you must install our VPN', 8, 22, { color: '#cfe3ff' });
      Pix.text(ctx, 'it makes your connection 100% anonymous and 100% fast', 8, 34, { color: '#7f9dc0' });
      if (p.stage === 0) {
        Pix.panel(ctx, 20, 56, 140, 18, '#1b6b8a', '#4aa8c8', '#0a2a38');
        Pix.text(ctx, 'INSTALL VPN (2 MB)', 34, 61, { color: '#ffffff' });
        p._inst = { x: 20, y: 56, w: 140, h: 18 };
        Pix.text(ctx, 'no account needed. no questions asked.', 20, 84, { color: '#7f9dc0' });
        Pix.text(ctx, 'we never ask questions. that is the problem.', 20, 96, { color: '#5f7d9f' });
      } else if (p.stage === 1) {
        Pix.text(ctx, 'Installing ALL-SECURE VPN...', 20, 60, { color: '#63b3ff' });
        const bw = 260;
        Pix.inset(ctx, 20, 74, bw, 12, '#06101f', '#2a4a6a', '#4a7aa0');
        Pix.rect(ctx, 21, 75, Math.round((bw - 2) * p.prog), 10, '#1b6b8a');
        Pix.text(ctx, 'installing keyboard layout driver...', 20, 92, { color: '#7f9dc0' });
        Pix.text(ctx, 'installing system proxy...', 20, 102, { color: '#7f9dc0' });
        Pix.text(ctx, 'installing... something else...', 20, 112, { color: '#ff7eb6' });
      } else {
        Pix.text(ctx, 'VPN INSTALLED!', 20, 60, { color: '#68dd72', font: Pix.FONT.bold });
        Pix.text(ctx, 'you are now anonymous. and also very interesting.', 20, 76, { color: '#cfe3ff' });
        Pix.text(ctx, 'starting your download...', 20, 90, { color: '#7f9dc0' });
      }
      p.contentH = 140;
    };
    p.click = function (rx, ry, win) {
      if (p.stage !== 0) return;
      if (p._inst && rx >= p._inst.x && rx <= p._inst.x + p._inst.w && ry >= p._inst.y && ry <= p._inst.y + p._inst.h) {
        window.Sfx.click();
        p.stage = 1;
        p.prog = 0;
        window.Sfx.dial();
      }
    };
    p.update = function (win, dt, t) {
      if (p.stage === 1) {
        p.prog = Math.min(1, p.prog + dt * 0.7);
        if (p.prog >= 1) {
          p.stage = 2;
          window.Sfx.modemStop();
          window.GAME.infect('keylog', 'ALL-SECURE VPN');
          window.GAME.toast('VPN installed. It also installed a keylogger.', '#ff5f56');
          window.GAME.advanceTime(5);
          setTimeout(() => window.GAME.reallyDownload(win, p.site, p.link), 900);
        }
      }
    };
    return p;
  };

  /* ---------------- the app ---------------- */

  const App = {
    title: 'WebCruiser 98',
    icon: 'browser',
    w: 464,
    h: 244,
    accent: '#2b3f8f',

    init(win) {
      win.state = {
        history: [{ page: Pages.home() }],
        index: 0,
        url: 'http://www.coolweb2003.com/',
        loading: 0,
        loadingTo: null,
        status: 'Done',
        input: '',
        inputFocused: false,
      };
    },

    page(win) { return win.state.history[win.state.index].page; },

    go(win, target) {
      const st = win.state;
      let page;
      if (target === 'home') page = Pages.home();
      else if (target === 'forum') page = Pages.forum();
      else if (target === 'jabber') page = Pages.jabber();
      else if (target === 'checker') page = Pages.checker();
      else if (target === 'about') page = Pages.about();
      else if (target === 'ad') page = Pages.ad();
      else if (target.startsWith('site:')) page = Pages.site(target.slice(5));
      else if (target.startsWith('survey:')) {
        const [sid, lid] = target.slice(7).split('|');
        page = Pages.survey(sid, lid);
      } else if (target.startsWith('member:')) {
        const [sid, lid] = target.slice(7).split('|');
        page = Pages.member(sid, lid);
      } else if (target.startsWith('vpn:')) {
        const [sid, lid] = target.slice(4).split('|');
        page = Pages.vpn(sid, lid);
      } else if (target.startsWith('download:')) {
        const [sid, lid] = target.slice(9).split('|');
        const site = Data.SITES.find((s) => s.id === sid);
        const link = site && site.links.find((l) => l.id === lid);
        page = Pages.download(site, link);
      }
      if (!page) return;
      st.history = st.history.slice(0, st.index + 1);
      st.history.push({ page });
      st.index = st.history.length - 1;
      st.url = urlFor(page);
      st.status = 'Done';
      window.Sfx.select();
      window.GAME.advanceTime(2);
    },

    back(win) {
      const st = win.state;
      if (st.index > 0) {
        st.index--;
        st.url = urlFor(st.history[st.index].page);
        window.Sfx.back();
        window.GAME.advanceTime(1);
      } else {
        window.Sfx.deny();
      }
    },

    forward(win) {
      const st = win.state;
      if (st.index < st.history.length - 1) {
        st.index++;
        st.url = urlFor(st.history[st.index].page);
        window.Sfx.back();
      } else {
        window.Sfx.deny();
      }
    },

    draw(ctx, win, r, t) {
      const st = win.state;
      const page = this.page(win);
      // toolbar
      Pix.rect(ctx, r.x, r.y, r.w, TOOL_H, '#20263c');
      Pix.rect(ctx, r.x, r.y + TOOL_H - 1, r.w, 1, '#12142a');
      const btns = [['<', 'back'], ['>', 'fwd'], ['H', 'home'], ['X', 'stop']];
      btns.forEach((b, i) => {
        Pix.panel(ctx, r.x + 4 + i * 12, r.y + 3, 10, 10, '#2f3550', '#5a6088', '#12142a');
        Pix.text(ctx, b[0], r.x + 4 + i * 12 + (b[0].length > 1 ? 2 : 4), r.y + 4, { color: '#e9e7e2' });
      });
      // address bar
      Pix.inset(ctx, r.x + 56, r.y + 2, 250, 12, '#0a0f1c', '#2a3350', '#48507a');
      Pix.text(ctx, st.url, r.x + 60, r.y + 4, { color: '#cfe3ff' });
      Pix.panel(ctx, r.x + 310, r.y + 2, 26, 12, '#2f3550', '#5a6088', '#12142a');
      Pix.text(ctx, 'GO', r.x + 317, r.y + 4, { color: '#e9e7e2' });
      Pix.panel(ctx, r.x + 340, r.y + 2, 40, 12, '#2f3550', '#5a6088', '#12142a');
      Pix.text(ctx, 'FAVORITES', r.x + 344, r.y + 4, { color: '#9fb0ff' });
      // bookmarks bar
      Pix.rect(ctx, r.x, r.y + 15, r.w, 11, '#2a3050');
      const marks = ['COOLWEB', 'THE FORUM', 'GAME DOWNLOADS', 'FREE MIDI', 'PRIZES!!!', 'MY PC'];
      let mx = r.x + 5;
      for (const m of marks) {
        Pix.text(ctx, m, mx, r.y + 17, { color: '#b9c4ff' });
        mx += Pix.measure(ctx, m) + 10;
      }

      // content
      const cx = r.x, cy = r.y + TOOL_H, cw = r.w, ch = r.h - TOOL_H - STATUS_H;
      window.GAME.browser.visibleH = ch;
      Pix.rect(ctx, cx, cy, cw, ch, '#11141f');
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, cy, cw, ch);
      ctx.clip();
      ctx.translate(cx, cy - page.scroll);
      page.draw(ctx, { x: 0, y: 0, w: cw, h: ch }, t);
      ctx.restore();
      // scrollbar
      if (page.contentH > ch) {
        Pix.scrollbar(ctx, cx + cw - 6, cy, ch, ch / page.contentH, page.scroll / (page.contentH - ch));
      }
      // status bar
      const sy = r.y + r.h - STATUS_H;
      Pix.rect(ctx, r.x, sy, r.w, STATUS_H, '#20263c');
      Pix.rect(ctx, r.x, sy, r.w, 1, '#12142a');
      Pix.text(ctx, st.status, r.x + 4, sy + 2, { color: '#9b958c' });
      Pix.text(ctx, page.type === 'forum' ? 'forum' : page.type === 'site' ? 'download site' : 'page', r.x + r.w - 6, sy + 2, { color: '#6a655e', align: 'right' });
    },

    mouse(win, r, x, y, type, btn) {
      const st = win.state;
      const page = this.page(win);
      const cx = r.x, cy = r.y + TOOL_H;
      if (type === 'down') {
        if (y < r.y + TOOL_H) {
          const idx = Math.floor((x - r.x - 4) / 12);
          if (idx >= 0 && idx < 4 && x >= r.x + 4 && x <= r.x + 52) {
            if (idx === 0) this.back(win);
            else if (idx === 1) this.forward(win);
            else if (idx === 2) this.go(win, 'home');
            else { st.status = 'Stopped.'; window.Sfx.deny(); }
            return;
          }
          if (x >= r.x + 56 && x <= r.x + 306 && y >= r.y + 2 && y <= r.y + 14) {
            st.status = 'Type a URL and press GO. Or just click a link.';
            return;
          }
        }
        if (y >= r.y + TOOL_H && y <= r.y + r.h - STATUS_H) {
          const rx = x - cx, ry = y - cy + page.scroll;
          if (page.type === 'home') { page.click(rx, ry, win); page.clickAd && page.clickAd(rx, ry, win); }
          else page.click(rx, ry, win);
        }
      }
      if (type === 'move') {
        if (page.type === 'home' && page._links) {
          for (const l of page._links) {
            const hov = y >= cy + l.y - page.scroll && y <= cy + l.y - page.scroll + l.h && x < cx + 210;
            if (l._hover !== hov) { l._hover = hov; window.Sfx.select(); }
          }
        }
      }
    },

    wheel(win, r, x, y, dy) {
      const page = this.page(win);
      const max = Math.max(0, page.contentH - (r.h - TOOL_H - STATUS_H));
      page.scroll = Math.max(0, Math.min(max, page.scroll + dy * 16));
    },

    key(win, e) {
      const page = this.page(win);
      if (page.type === 'checker' && page.focused) {
        if (e.key === 'Backspace') { page.value = page.value.slice(0, -1); return true; }
        if (e.key.length === 1) { page.value += e.key; return true; }
        if (e.key === 'Enter') { page.result = window.GAME.checkSite(page.value); return true; }
      }
      if (page.type === 'ad' && page.focusField) {
        if (e.key === 'Backspace') { page[page.focusField] = page[page.focusField].slice(0, -1); return true; }
        if (e.key.length === 1) { page[page.focusField] += e.key; return true; }
      }
      return false;
    },

    update(win, dt, t) {
      const page = this.page(win);
      if (page.update) page.update(win, dt, t);
    },
  };

  function urlFor(page) {
    switch (page.type) {
      case 'home': return 'http://www.coolweb2003.com/';
      case 'forum': return 'http://www.coolweb2003.com/forum/thread.php?id=8814';
      case 'jabber': return 'http://www.sitejabber.com/reviews';
      case 'checker': return 'http://www.safesitechecker.tk/';
      case 'about': return 'http://www.coolweb2003.com/about.html';
      case 'ad': return 'http://total-free-stuff.example/claim';
      case 'site': return 'http://www.' + page.site.name.toLowerCase() + '/game/';
      case 'download': return 'http://www.' + (page.site ? page.site.name.toLowerCase() : 'x') + '/dl/';
      default: return 'about:blank';
    }
  }

  App.Pages = Pages;
  App.TOOL_H = TOOL_H;
  App.STATUS_H = STATUS_H;
  window.BrowserApp = App;
  return App;
})();
