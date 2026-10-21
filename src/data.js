/* CRACK'D - all the content: sites, forum thread, viruses, endings, minigame level. */
window.Data = (function () {
  /* The hash of the one file that is actually clean, buried in the thread. */
  const GOOD_HASH = '7c1e9a44f0b8d2e63c7a5b90f1e2d3c4';

  const VIRUSES = {
    popup: {
      name: 'MegaPop Adware', sev: 6, icon: 'virus',
      desc: 'Opens pop-up windows. Politely. But constantly.',
    },
    adware: {
      name: 'CouponBuddy Adware', sev: 12, icon: 'virus',
      desc: 'Injects discount coupons into every website you visit.',
    },
    fakeav: {
      name: 'ScareAV Fake Antivirus', sev: 14, icon: 'virus',
      desc: 'Scares you into buying a premium antivirus. From the virus.',
    },
    cookie: {
      name: 'CookieThief Stealer', sev: 10, icon: 'virus',
      desc: 'Steals cookies. Your browser is now very friendly.',
    },
    script: {
      name: 'AutoRun Script', sev: 6, icon: 'virus',
      desc: 'Runs on startup. Does not say what.',
    },
    miner: {
      name: 'CoinMine CPU Miner', sev: 18, icon: 'virus',
      desc: 'Your fan is louder than your graphics card now.',
    },
    trojan: {
      name: 'CrackTrojan.Win32', sev: 22, icon: 'virus',
      desc: 'Disguised as a crack. It is not a crack.',
    },
    keylog: {
      name: 'SpyKey.Win32 Keylogger', sev: 26, icon: 'virus',
      desc: 'Records everything you type. Everything.',
    },
    rootkit: {
      name: 'ShadowRoot Rootkit', sev: 20, icon: 'virus',
      desc: 'Hides itself from the file manager. And from you.',
    },
    ransom: {
      name: 'RANSOMWARE', sev: 30, icon: 'skull',
      desc: 'Your files are encrypted. The ransom asks for crypto.',
    },
  };

  /* Each site has one or more download links. Each link is a different file
     with its own md5 and its own baggage. */
  const SITES = [
    {
      id: 'pixeldungeon',
      name: 'PIXELDUNGEON-DL.NET',
      tagline: 'The legendary one. Games since 2003.',
      style: 'modern',
      accent: '#68dd72',
      bg: '#0d2b18',
      badge: '100% VIRUS FREE - VERIFIED',
      badgeNote: '(the site owner wrote that)',
      comments: [
        { u: 'BigDolphin', t: 'works great, 10/10 would malware again' },
        { u: 'realGamer', t: 'my antivirus says its fine but my antivirus is an idiot' },
        { u: 'nina_97', t: 'downloaded the FAST one, my pc makes helicopter noises now' },
      ],
      links: [
        {
          id: 'pd-main', label: 'DOWNLOAD NOW', size: '2.1 GB', md5: '9a1c73e5b0d2f8a4c6e1b3d5f7a9c0e2',
          viruses: ['popup', 'adware', 'fakeav'], bundled: true, speed: 'DSL',
        },
        {
          id: 'pd-fast', label: 'FAST MIRROR (sponsored)', size: '2.0 GB', md5: '1b2c3d4e5f60718293a4b5c6d7e8f901',
          viruses: ['popup', 'adware', 'miner', 'fakeav', 'trojan'], bundled: true, speed: 'FAST', sponsored: true,
        },
      ],
    },
    {
      id: 'vault',
      name: 'VAULT-OF-GAMES.CLICK',
      tagline: 'no ads. no virus. no speed either.',
      style: 'ugly',
      accent: '#ffc94d',
      bg: '#241a06',
      badge: 'best site evr',
      badgeNote: '(typed by hand, 2011)',
      comments: [
        { u: 'anonymous', t: 'downloaded 1 file, waited 6 hours, 0 viruses. 10/10' },
        { u: 'mr_tiny', t: 'it works??' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'vg-main', label: 'CLICK HERE TO DOWNLOAD', size: '2.1 GB', md5: GOOD_HASH,
          viruses: [], speed: '56k',
        },
        {
          id: 'vg-fast', label: 'CLICK HERE (MIRROR)', size: '2.0 GB', md5: '5f4e3d2c1b0a99887766554433221100',
          viruses: ['popup', 'cookie'], speed: 'DSL',
        },
      ],
    },
    {
      id: 'gamerz',
      name: 'GAMERZ-ERA.TO',
      tagline: 'Community trusted since 2011. 1000+ downloads.',
      style: 'forum',
      accent: '#63b3ff',
      bg: '#0b1b33',
      badge: 'TRUSTED BY THE COMMUNITY',
      badgeNote: '(the community is 3 people)',
      avBlock: true,
      comments: [
        { u: 'pixel_fan', t: 'zip contains setup + crack + keygen. keygen flagged as hacktool' },
        { u: 'dungeonlord', t: 'the game itself is fine, its 9/10 but the keygen is scary' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'ge-main', label: 'DOWNLOAD ZIP (setup + crack + keygen)', size: '2.3 GB', md5: '2c3d4e5f60718293a4b5c6d7e8f9a0b1c',
          viruses: [], hackTool: true, speed: 'DSL',
        },
      ],
    },
    {
      id: 'dfg',
      name: 'DOWNLOAD-FREE-GAMES.TOP',
      tagline: 'SLOW BUT WORKING. VERY SLOW.',
      style: 'plain',
      accent: '#e2554f',
      bg: '#2b0f0f',
      badge: 'FREE GAMES FOR EVERYONE',
      gate: 'survey',
      comments: [
        { u: 'patient_one', t: 'took 9 hours. 0 viruses. would not recommend' },
        { u: 'dungeonlord', t: 'the game itself is fine, its 9/10 but the keygen is scary' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'df-main', label: 'DOWNLOAD (please wait)', size: '2.1 GB', md5: '3d4e5f60718293a4b5c6d7e8f9a0b1c2d',
          viruses: ['popup', 'popup', 'adware'], speed: '56k',
        },
      ],
    },
    {
      id: 'vxtreme',
      name: 'VXTREME-DOWNLOADS.XYZ',
      tagline: 'VIP SUPER FAST. GUARANTEED CLEAN.',
      style: 'loud',
      accent: '#ff7eb6',
      bg: '#33062a',
      badge: 'ZERO VIRUSES. TRUST ME BRO.',
      gate: 'member',
      comments: [
        { u: 'crystalsxx', t: 'it says its clean' },
        { u: 'moms_friend', t: 'it encrypted my files and i am 58' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'vx-main', label: 'DOWNLOAD (VIP)', size: '2.1 GB', md5: '4e5f60718293a4b5c6d7e8f9a0b1c2d3e',
          viruses: ['ransom', 'keylog', 'miner', 'trojan', 'popup'], speed: 'FAST',
        },
        {
          id: 'vx-vip', label: 'VIP EXCLUSIVE LINK', size: '2.1 GB', md5: '5f60718293a4b5c6d7e8f9a0b1c2d3e4f',
          viruses: ['ransom', 'keylog', 'miner', 'trojan', 'popup', 'rootkit', 'cookie'], speed: 'LIGHTSPEED', sponsored: true,
        },
      ],
    },
    {
      id: 'megapix',
      name: 'MEGAPIX-CRACK.CLICK',
      tagline: 'BAIXE RAPIDO - CONFIA NO COROA',
      style: 'br',
      accent: '#68dd72',
      bg: '#0c2418',
      badge: 'CONFIAVEIS DESDE 2019',
      badgeNote: '(confiavel)',
      comments: [
        { u: 'br_mano', t: 'funcionou de boa, so uns ads chatos' },
        { u: 'vovo', t: 'meu neto que baixou' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'mp-main', label: 'BAIXAR AGORA (link turbo)', size: '2.1 GB', md5: '60718293a4b5c6d7e8f9a0b1c2d3e4f50',
          viruses: ['popup', 'cookie', 'script'], speed: 'FAST',
        },
      ],
    },
    {
      id: 'diskonect',
      name: 'DISKONECT-DL.RU',
      tagline: 'TORRENT + DDL. FREE FOREVER.',
      style: 'plain',
      accent: '#b18cff',
      bg: '#1b1030',
      badge: 'NO REGISTRATION NEEDED',
      gate: 'vpn',
      comments: [
        { u: 'seedish', t: 'it asks you to install a VPN first. why would it need that' },
        { u: 'nina_97', t: 'my antivirus says its fine but my antivirus is an idiot' },
      ],
      links: [
        {
          id: 'dk-main', label: 'DOWNLOAD (after installing our VPN)', size: '2.1 GB', md5: '718293a4b5c6d7e8f9a0b1c2d3e4f5061',
          viruses: [], speed: 'DSL',
        },
      ],
    },
  ];

  const FORUM = {
    title: 'PIXEL KNIGHT 3000 - which site is actually safe??',
    board: 'PC GAMES > general > downloads',
    replies: [
      {
        user: 'CrackerKing', op: true, time: '2 days ago', votes: 87,
        text: 'help. i just want to play pixel knight 3000 and every single site says "VIRUS FREE 100%". one of them gave my little brother a keylogger. is there ONE site in this whole internet that is actually safe, or should i just go to the store like a normal person',
      },
      {
        user: 'xX_Downloader_Xx', time: '2 days ago', votes: 42, link: 'pixeldungeon',
        text: 'bro just use pixeldungeon-dl.net, i downloaded 12 games from there and im still alive. they even have a green badge now so its obviously safe',
      },
      {
        user: 'AntiViru$', time: '1 year ago', votes: 210,
        text: 'DO NOT TRUST THE BADGE. the badge is written by the same guy who uploads the .exe. i scanned a "100% safe" download with 3 different antivirus and it STILL had a keylogger. badges mean literally nothing. read the comments, read the hashes, do not be the guy with the keylogger',
      },
      {
        user: 'noobslayer99', time: '6 months ago', votes: 63, link: 'vault',
        text: 'vault-of-games.click is the one. looks like a website made in microsoft paint in 2004, no ads, no virus, but it downloads at 56k so you will turn 40 years old waiting for it. still better than a keylogger',
      },
      {
        user: 'pixelpraxis', time: '4 months ago', votes: 154, truth: true,
        text: 'for whoever finds this in 2030: the file that actually works has md5 7c1e9a44f0b8d2e63c7a5b90f1e2d3c4. check the md5 BEFORE you open anything, on the page, not after. and do NOT touch the "sponsored fast mirror" buttons on those sites, they are a different file with a different md5',
      },
      {
        user: 'SteamFanBR', time: '3 weeks ago', votes: 12, link: 'megapix',
        text: 'BAIXEI no megapix-crack.click e funcionou de boa, so uns ads chatos no navegador. valeu pela dica',
      },
      {
        user: 'captcha_bot', time: '1 week ago', votes: 0, ad: 'iphone',
        text: 'FREE DOWNLOADS!!! FREE IPHONE 12 PRO MAX!!! CLICK HERE NOW >>> http://total-free-stuff.example/claim <<< BEST CRACKS EVER AT best-cracks-dot-example',
      },
      {
        user: 'GamerGhost', time: '2 months ago', votes: 31, link: 'diskonect',
        text: 'diskonect-dl.ru makes you install a "premium VPN" before the download. that VPN is the malware. its always the VPN. just dont',
      },
      {
        user: 'moderator_MOD', time: 'pinned', votes: 380, mod: true,
        text: 'Reminder: we do not allow direct links to cracked games in this thread and we never will. Also: a "verified" badge on a download site means the site owner typed "verified" on his own website. It means nothing. I have personally removed 40 of them this month.',
      },
      {
        user: 'PedroTech', time: '5 days ago', votes: 88,
        text: 'eu testei todos os 6 sites esse fim de semana. os 3 mais bonitos sao os piores. o mais feio e o mais seguro. a vida e injusta',
      },
      {
        user: '404NotFound', time: '1 month ago', votes: 120, link: 'vxtreme',
        text: 'vxtreme-downloads.xyz gave my mom ransomware. LITERALLY my mom. she paid 0.05 bitcoin to a man called "IT SUPPORT" on telegram. i am not joking and the man has a profile picture of a shark',
      },
      {
        user: 'CrashOverride', time: '3 days ago', votes: 44, link: 'gamerz',
        text: 'gamerz-era.to works but the antivirus blocks the keygen as a "hacktool". if you really want it you have to disable the antivirus, but... you know what you are doing at that point',
      },
    ],
  };

  const SITEJABBER = {
    title: 'SiteJabber - reviews of download sites',
    reviews: [
      {
        site: 'pixeldungeon', score: 4.5, count: 1204,
        quote: 'Fast! Clean! My whole family downloads here!',
        by: 'BigDolphin88', verified: true, paid: true,
      },
      {
        site: 'vault', score: 2.1, count: 8,
        quote: 'Ugly and slow but nothing bad ever happened to me here.',
        by: 'Dudebro88', verified: true, paid: false,
      },
      {
        site: 'vxtreme', score: 4.9, count: 3,
        quote: 'Best site. best ever. 5 stars!!!',
        by: 'new_account_1', verified: false, paid: true,
      },
      {
        site: 'dfg', score: 3.0, count: 41,
        quote: 'It works I guess. Took all night.',
        by: 'PatientOne', verified: true, paid: false,
      },
    ],
  };

  const ENDINGS = {
    clean: {
      title: 'GAME INSTALLED',
      lines: [
        'It runs. Actually runs.',
        'You pirated a game in 2003, on a computer that has',
        'a keyboard from 1998, and nobody in the world knows.',
        '',
        'The crack even came with a working keygen. The art is',
        'lovely. The music is one loop. You play it anyway.',
        '',
        'MORAL DAMAGE: 100%',
      ],
      color: '#68dd72',
    },
    clean2: {
      title: 'GAME INSTALLED',
      lines: [
        'It runs. Actually runs.',
        'Somehow you found the one honest link on the entire',
        'internet. The forum is still arguing about it.',
        '',
        'The other guys are still downloading. They are still',
        'downloading. They will be downloading tomorrow.',
        '',
        'MORAL DAMAGE: 100%',
      ],
      color: '#68dd72',
    },
    cleanInfected: {
      title: 'GAME INSTALLED',
      lines: [
        'It runs. Your computer is also running 14 things you',
        'never asked for, one of which is a cryptocurrency',
        'miner, and your fan sounds like a helicopter.',
        '',
        'The game is fine. The game is always fine.',
        'It is the other 40 files that will haunt you.',
        '',
        'MORAL DAMAGE: 100%',
      ],
      color: '#ffc94d',
    },
    crash: {
      title: 'GAME CRASHED',
      lines: [
        'PIXEL KNIGHT 3000 has crashed.',
        '',
        'This is, in fairness, exactly what a pirated game',
        'built by a teenager in 2003 was going to do.',
        '',
        'Your friend is still knocking.',
      ],
      color: '#9b958c',
    },
    ransom: {
      title: 'YOUR FILES ARE ENCRYPTED',
      lines: [
        'All of them. Including the ones you were going to',
        'delete anyway.',
        '',
        'The ransom note says 0.05 BTC or "a nice desktop wallpaper',
        'of your choice, we are flexible". It also has a QR code',
        'with a picture of a shark.',
        '',
        'You paid R$ 0,00 because that is how much you have.',
      ],
      color: '#ff5f56',
    },
    keylog: {
      title: 'ACCOUNT STOLEN',
      lines: [
        'The keylogger sent everything you typed to a server',
        'in a country you cannot spell.',
        '',
        'Your game store account is gone. It was traded, within',
        'minutes, for a second-hand plush toy and 400 Robux.',
        '',
        'You were typing your password when it happened.',
      ],
      color: '#ff7eb6',
    },
    bsod: {
      title: 'BLUE SCREEN',
      lines: [
        'STOP: 0x000000BE CRITICAL_STRUCTURE_CORRUPTION',
        '',
        'The machine gave up. It took 14 pop-up windows, a miner,',
        'a keylogger and a ransomware with you.',
        '',
        'Somewhere, a man with a shark picture is very happy.',
      ],
      color: '#63b3ff',
    },
    timeout: {
      title: 'TIME IS UP',
      lines: [
        'Sunday, 12:00. Your friend just knocked on the door.',
        '',
        'You have 3 folders called "setup", one of them is empty,',
        'and a download that is 94% complete.',
        '',
        '"ai tu viu o jogo?" - "quase"',
      ],
      color: '#ffc94d',
    },
    scam: {
      title: 'CARD SWALLOWED',
      lines: [
        'You won a free iPhone 12 Pro Max.',
        '',
        'It asked for your card number, your CPF, your mother\'s',
        'name and the name of your first pet. You gave all of it',
        'because it was a FREE PRIZE and you were so close to',
        'playing the game.',
        '',
        'Your bank will call tomorrow. Say yes it was you.',
      ],
      color: '#ff7eb6',
    },
    av: {
      title: 'THE AV WAS THE VIRUS',
      lines: [
        'You paid R$ 49,90 for the premium antivirus.',
        '',
        'The premium antivirus was the virus. It was always the',
        'virus. The trial version was the only honest thing on',
        'your computer.',
        '',
        'The good news: your PC is now very well protected.',
        'From you.',
      ],
      color: '#b18cff',
    },
    rootkit: {
      title: 'NOTHING HERE',
      lines: [
        'The folder is empty.',
        '',
        'It was empty before you opened it. It is empty now.',
        'The file manager does not show it. The virus does not',
        'show. The virus is the file.',
        '',
        'You close the folder. The folder is still empty.',
      ],
      color: '#9b958c',
    },
    shutdown: {
      title: 'POWER OFF',
      lines: [
        'You turned off the computer.',
        '',
        'The download was at 97%. The modem was still making',
        'those little modem noises. You could have waited four',
        'more minutes.',
        '',
        'Four more minutes.',
      ],
      color: '#9b958c',
    },
  };

  /* Mini-game level for PIXEL KNIGHT 3000 (the thing you pirated). */
  const LEVEL = {
    obstacles: [
      { type: 'spike', x: 260 },
      { type: 'spike', x: 320 },
      { type: 'spike', x: 380 },
      { type: 'gap', x: 470, len: 2 },
      { type: 'spike', x: 620 },
      { type: 'spike', x: 700 },
      { type: 'spike', x: 720 },
      { type: 'gap', x: 830, len: 2 },
      { type: 'spike', x: 980 },
      { type: 'spike', x: 1050 },
      { type: 'spike', x: 1080 },
      { type: 'gap', x: 1180, len: 3 },
      { type: 'spike', x: 1330 },
      { type: 'spike', x: 1380 },
      { type: 'spike', x: 1400 },
      { type: 'spike', x: 1420 },
      { type: 'gap', x: 1520, len: 2 },
      { type: 'spike', x: 1680 },
      { type: 'spike', x: 1760 },
      { type: 'spike', x: 1790 },
      { type: 'gap', x: 1900, len: 2 },
      { type: 'spike', x: 2050 },
      { type: 'spike', x: 2120 },
      { type: 'spike', x: 2140 },
    ],
    coins: [150, 400, 560, 760, 900, 1120, 1290, 1450, 1610, 1840, 1980, 2200],
    finish: 2380,
  };

  return { GOOD_HASH, VIRUSES, SITES, FORUM, SITEJABBER, ENDINGS, LEVEL };
})();
