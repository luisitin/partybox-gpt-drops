/**
 * B17 v1 (the first delivery, 2026-10), kept byte-for-byte in behaviour as the anchor for the sealed
 * blind oracle: reference.ts re-derives exactly this recipe, so the tests still prove the meter,
 * master and encoder against an implementation written without this code. The product is v2
 * (recipes.ts + dsp.ts, exposed by sfx.ts); nothing here ships to PartyBox.
 */
import {RATE} from './meter.js';
import type {Rng} from './dsp.js';
export interface LegacySound {readonly id:string;readonly name:string;readonly seconds:number;readonly kind:'tone'|'sweep'|'noise'|'sequence';readonly hz:number;readonly endHz:number;readonly notes:readonly number[];readonly texture:number;readonly decay:number;readonly description:string}
const make=(id:string,name:string,kind:LegacySound['kind'],hz:number,endHz:number,seconds:number,notes:readonly number[],texture:number,decay:number,description:string):LegacySound=>({id,name,kind,hz,endHz,seconds,notes,texture,decay,description});
export const LEGACY_SOUNDS:readonly LegacySound[]=[
 make('coin','Coin','sequence',880,880,.72,[880,1320,1760],.05,1.2,'Three metallic ascending partials'),
 make('star-get','Star get','sequence',660,660,1.1,[660,880,1100,1320],.04,.8,'Bright four-note reward arpeggio'),
 make('dice-roll','Dice roll','noise',150,320,.9,[],.65,.3,'Rhythmic rattling filtered noise'),
 make('dice-stop','Dice stop','tone',210,95,.52,[],.2,1.5,'Low wooden landing with a tonal body'),
 make('step','Step','noise',120,65,.46,[],.55,1.5,'Soft low impact with rustling attack'),
 make('buzzer','Buzzer','tone',145,145,.68,[],.2,.2,'Rough detuned error buzz'),
 make('ding','Ding','tone',1046,1046,.85,[],.04,1.8,'Clear harmonic confirmation bell'),
 make('whoosh','Whoosh','sweep',250,2200,.8,[],.45,.3,'Ascending airy sweep'),
 make('pop','Pop','sweep',700,180,.48,[],.08,1.8,'Round falling bubble tone'),
 make('countdown-tick','Countdown tick','tone',900,900,.45,[],.02,1.6,'Compact dry countdown cue'),
 make('final-tick','Final tick','sequence',1100,1100,.56,[1100,1650],.02,1.2,'Higher double countdown accent'),
 make('win-fanfare','Win fanfare','sequence',523,523,1.65,[523,659,784,1046,1318],.03,.3,'Five-note major victory figure'),
 make('lose','Lose','sequence',440,440,1.2,[440,370,311,220],.12,.7,'Descending minor disappointment'),
 make('item-use','Item use','sweep',340,1450,.85,[],.15,.5,'Glowing upward activation chirp'),
 make('shop-open','Shop open','sequence',392,392,1.05,[392,494,587,784],.08,.8,'Friendly rising shop chord'),
 make('vote','Vote','tone',540,610,.6,[],.06,1.3,'Small affirmative pluck'),
 make('reveal','Reveal','sweep',180,1050,1.2,[],.18,.2,'Swelling suspense into a bright reveal'),
 make('timer-warning','Timer warning','sequence',880,880,.9,[880,880,1175],.1,.5,'Three urgent rising notes'),
 make('menu-move','Menu move','tone',460,500,.46,[],.01,1.4,'Muted navigation tap'),
 make('menu-back','Menu back','sweep',580,290,.55,[],.02,1.0,'Falling navigation chirp'),
 make('confirm','Confirm','sequence',660,660,.64,[660,990],.02,1.0,'Two-note upward approval'),
 make('cancel','Cancel','sequence',540,540,.64,[540,360],.06,1.0,'Two-note downward cancellation'),
 make('join','Player join','sequence',392,392,.9,[392,523,659],.03,.8,'Warm arrival triad'),
 make('leave','Player leave','sequence',659,659,.9,[659,523,392],.03,.8,'Soft descending departure'),
 make('ready','Ready','tone',784,784,.62,[],.03,1.0,'Bright sustained readiness blip'),
 make('start','Game start','sequence',440,440,1.15,[440,554,659,880],.06,.5,'Rising start flourish'),
 make('round-end','Round end','sequence',784,784,1.1,[784,659,523],.03,.4,'Relaxed closing cadence'),
 make('bonus','Bonus','sequence',987,987,1.05,[987,1244,1480,1975],.03,.8,'Sparkling high reward cascade'),
 make('penalty','Penalty','tone',185,138,.7,[],.18,.7,'Grainy low penalty fall'),
 make('teleport','Teleport','sweep',380,1900,1.0,[],.12,.2,'Modulated rising transport beam'),
 make('shield','Shield','tone',294,294,1.1,[],.08,.4,'Warm humming protective field'),
 make('power-up','Power up','sweep',220,1760,1.25,[],.07,.3,'Octave-spanning energized rise'),
 make('power-down','Power down','sweep',1760,220,1.25,[],.08,.6,'Long falling energy discharge'),
 make('notification','Notification','sequence',698,698,.84,[698,880,698],.02,.8,'Gentle three-note attention cue'),
 make('achievement','Achievement','sequence',587,587,1.5,[587,740,880,1175,1480],.04,.5,'Extended major accomplishment motif'),
 make('error','Error','sequence',220,220,.76,[220,196,220],.15,.5,'Three dark rejection pulses'),
 make('splash','Splash','noise',400,90,.85,[],.8,.7,'Falling textured synthetic water burst'),
 make('bounce','Bounce','sweep',460,160,.58,[],.02,1.0,'Elastic descending spring chirp'),
 make('swipe','Swipe','sweep',1800,400,.6,[],.3,.2,'Short downward airy gesture'),
 make('connect','Connect','sequence',330,330,.95,[330,440,660],.02,.7,'Rising connected-state chord')
];
export function synthesizeLegacyRaw(sound:LegacySound,rng:Rng):Float64Array {
  const length=Math.round(sound.seconds*RATE), out=new Float64Array(length);
  let phase=0, filtered=0;
  for(let i=0;i<length;i++) {
    const t=i/RATE,u=i/(length-1);
    let hz=sound.hz+(sound.endHz-sound.hz)*u;
    let envelope=Math.exp(-sound.decay*u);
    if(sound.kind==='sequence') {
      const step=Math.min(sound.notes.length-1,Math.floor(u*sound.notes.length));
      hz=sound.notes[step]!;
      const local=u*sound.notes.length-step;
      envelope*=.65+.35*Math.sin(Math.PI*local)**2;
    }
    if(sound.kind==='sweep') hz=sound.hz*Math.pow(sound.endHz/sound.hz,u);
    phase+=2*Math.PI*hz/RATE;
    const random=rng(); if(!(random>=0&&random<1)) throw new RangeError('RNG must return [0,1)');
    filtered=.72*filtered+.28*(2*random-1);
    let value=Math.sin(phase)+.22*Math.sin(2*phase)+.09*Math.sin(3*phase);
    if(sound.kind==='noise') value=.35*value+.85*filtered*(.6+.4*Math.sin(2*Math.PI*13*t)**2);
    if(sound.id==='buzzer'||sound.id==='error') value+=.25*Math.sin(phase*1.012);
    if(sound.id==='teleport') value*=.7+.3*Math.sin(2*Math.PI*9*t);
    out[i]=Math.tanh(value+sound.texture*filtered)*envelope;
  }
  return out;
}
