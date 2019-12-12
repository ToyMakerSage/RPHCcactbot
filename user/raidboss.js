'use strict';

//Custom Config for raidboss for use by RPHC Static in TEA
//v0.2
//Build Date 12/12/2019 

//Override for Shortening Static Member's Names
Options.PlayerNicks = {
  'Reinhardt Stark': 'Reinhardt',
  'Papa Fabio': 'Fabio',
  'Phoenix Flight': 'Phoenix',
  'Rai Blue': 'Rai',
  'Hassan Sh': 'Hassan',
  'Silver Cat': 'Silver',
  'Kite Kizoku': 'Kite',
  'High-quality Momo': 'Momo',
};

// Disable TEA Triggers that have been replaced with custom or total replacements
Options.DisabledTriggers = {
  'TEA Brute Phase': true,
  'TEA Limit Cut Numbers': true,
  'TEA Limit Cut Knockback': true,
};

//Custom Triggers for TEA
Options.Triggers = [
  //{
  //  zoneRegex: /./,
  //  triggers: [
  //    {
  //      id: 'Game Over Yeah',
  //      regex: /21:........:40000005:/,
  //      sound: '../../resources/sounds/Momo/gameoveryeah.ogg',
  //      volume: 0.5,
  //    },
  //  ],
  //},
  {
    zoneRegex: /^The Epic [Oo]f Alexander \(Ultimate\)$/,
    triggers: [
      {
        id: 'Custom TEA Instance Reset',
        regex: /21:........:400000(01|10):/
        suppressSeconds: 5,
        preRun: function(data) {
          data.phase = 'p0';
        },
      },
      {
        id: 'Custom TEA Phase 2 Transition',
        regex: Regexes.addedCombatant({ name: 'Cruise Chaser', capture: false }),
        condition: function(data) {
          return data.phase == 'p0';
        },
        suppressSeconds: 5,
        preRun: function(data) {
          data.phase = 'p1t';
        },
      },
      {
        id: 'Custom P1T Explosion Counter',
    regex: Regexes.ability({ source: 'Cruise Chaser', id: '4830', capture: false }),
    condition: function(data) {
      return data.phase == 'p1t';
    },
    suppressSeconds: 1,
    preRun: function(data) {
      data.puddlecount = (data.puddlecount || 0) + 1;
    },
    infoText: function(data) {
          if(data.south)
          {
            if(data.puddlecount == 7 || data.puddlecount == 3)
            {
              return;
            }
            else
            {
              return {
                en: 'Puddle #'+data.puddlecount,
              };
            }
          }
          else
          {
            if (data.puddlecount == 2 || data.puddlecount == 6)
            {
              return;
            }
            else
            {
              return {
                en: 'Puddle #'+data.puddlecount,
              };
            }
          }
        },
        alertText: function(data) {
          if(data.south)
          {
            if(data.puddlecount == 7 || data.puddlecount == 3)
            {
              return {
                en: 'Puddle #'+data.puddlecount+'\nStop Ahead!',
              };
            }
            else
            {
              return;
            }
          }
          else
          {
            if (data.puddlecount == 2 || data.puddlecount == 6)
            {
              return {
                en: 'Puddle #'+data.puddlecount+'\nStop Ahead!',
              };
            }
            else
            {
              return;
            }
          }
        },
    },
      {
      // Applies to both limit cuts.
        id: 'Custom TEA Limit Cut Numbers',
        regex: Regexes.headMarker({ id: '00(?:4F|5[0-6])' }),
        condition: function(data, matches) {
          return data.me == matches.target;
        },
        preRun: function(data, matches) {
          data.limitCutNumber = {
            '004F': 1,
            '0050': 2,
            '0051': 3,
            '0052': 4,
            '0053': 5,
            '0054': 6,
            '0055': 7,
            '0056': 8,
          }[matches.id];
          if (data.phase == 'wormhole') {
            data.limitCutDelay = {
              '004F': 9.2,
              '0050': 10.7,
              '0051': 13.4,
              '0052': 15.0,
              '0053': 17.7,
              '0054': 19.2,
              '0055': 22.0,
              '0056': 23.4,
            }[matches.id];
          } else {
            data.limitCutDelay = {
              '004F': 9.5,
              '0050': 11,
              '0051': 14.1,
              '0052': 15.5,
              '0053': 18.6,
              '0054': 20,
              '0055': 23.2,
              '0056': 24.6,
            }[matches.id];
          }
          if (data.phase == 'p1t') {
            data.south = {//Added data.south boolean to track if north or south (0 = North, 1 = South)
              '004F':0,
              '0050':0,
              '0051':1,
              '0052':1,
              '0053':0,
              '0054':0,
              '0055':1,
              '0056':1,
            }[matches.id];
            data.puddlecount = 0; //Initialising a puddle counter for Limit Cut blasters (Not sure if needed?)
          }
        },
        alertText: function(data) {
          if(data.south) {
            return {en: '#' + data.limitCutNumber + '\nSouth/West',};
          }else{
            return {en: '#' + data.limitCutNumber + '\nNorth/East',};
          }
        },
      },
      {
        id: 'Custom TEA Brute Phase',
        regex: Regexes.startsUsing({ source: 'Brute Justice', id: '483E', capture: false }),
        regexDe: Regexes.startsUsing({ source: 'Brutalus', id: '483E', capture: false }),
        regexFr: Regexes.startsUsing({ source: 'Justicier', id: '483E', capture: false }),
        regexJa: Regexes.startsUsing({ source: 'ブルートジャスティス', id: '483E', capture: false }),
        run: function(data) {
          data.phase = 'brute';
          data.resetState = function() {
            this.enumerations = [];
            this.buffMap = {};
            this.tetherBois = {};
            delete this.limitCutNumber;
            delete this.limitCutDelay;
            delete this.puddlecount;
            delete this.south;
          };
          data.resetState();
          data.nisiNames = {
            en: {
              0: 'Blue α',
              1: 'Orange β',
              2: 'Purple γ',
              3: 'Green δ',
            },
            de: {
              0: 'Blau α',
              1: 'Orange β',
              2: 'Lila γ',
              3: 'Grün δ',
            },
          }[data.lang];
          // Convenience function called for third and fourth nisi passes.
          data.namedNisiPass = (data) => {
            // error?
            if (!(data.me in data.finalNisiMap)) {
              return {
                en: 'Get Final Nisi (?)',
                de: 'Nehme letzten Nisi (?)',
              };
            }
            if (data.me in data.nisiMap) {
              // If you have nisi, you need to pass it to the person who has that final
              // and who doesn't have nisi.
              let myNisi = data.nisiMap[data.me];
              let names = Object.keys(data.finalNisiMap);
              names = names.filter((x) => data.finalNisiMap[x] == myNisi && x != data.me);
              let namesWithoutNisi = names.filter((x) => !(x in data.nisiMap));
              if (namesWithoutNisi.length == 0) {
                // Still give something useful here.
                return {
                  en: 'Pass ' + myNisi + ' Nisi',
                  de: 'Gebe ' + myNisi + ' Nisi',
                };
              }
              // Hopefully there's only one here, but you never know.
              return {
                en: 'Pass ' + data.nisiNames[myNisi] + ' to ' +
                    names.map((x) => data.ShortName(x)).join(', or '),
                de: 'Gebe ' + data.nisiNames[myNisi] + ' zu ' +
                    names.map((x) => data.ShortName(x)).join(', oder '),
              };
            }
            // If you don't have nisi, then you need to go get it from a person who does.
            let myNisi = data.finalNisiMap[data.me];
            let names = Object.keys(data.nisiMap);
            names = names.filter((x) => data.nisiMap[x] == myNisi);
            if (names.length == 0) {
              return {
                en: 'Get ' + data.nisiNames[myNisi],
                de: 'Nimm ' + data.nisiNames[myNisi],
              };
            }
            return {
              en: 'Nimm ' + data.nisiNames[myNisi] + ' von ' + data.ShortName(names[0]),
            };
          };
        },
      },
    ],
  },
];