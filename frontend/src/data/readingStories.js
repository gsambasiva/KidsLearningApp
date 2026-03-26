/**
 * SmartKids Reading Engine — Dynamic Story Database
 * Generates 25+ unique, grade-appropriate stories per grade level (K–5)
 * Each story includes: title, content, vocabulary, 3 MCQ + 2 T/F + 1 fill-blank questions
 */

// ─── UTILITY ─────────────────────────────────────────────────────────────────
const pick = (arr, i) => arr[Math.abs(Math.floor(i)) % arr.length];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── SHARED VARIABLE POOLS ───────────────────────────────────────────────────
const NAMES_K1   = ['Sam','Lily','Ben','Ella','Max','Zoe','Leo','Maya','Jake','Ava','Tom','Mia'];
const NAMES_23   = ['Oliver','Sophia','Lucas','Emma','Noah','Priya','Liam','Mason','Chloe','Ethan','Isabel','Nathan'];
const NAMES_45   = ['Alexander','Victoria','Benjamin','Natalie','Marcus','Elena','Theodore','Penelope','Rafael','Amara'];
const RELATIVES  = ['mom','dad','grandma','grandpa','aunt','uncle'];
const SEASONS    = ['spring','summer','autumn','winter'];
const WEATHER    = ['sunny','rainy','windy','snowy','cloudy'];
const PLACES_K   = ['park','backyard','garden','playground','yard','meadow'];
const PLACES_OUT = ['forest trail','riverbank','mountain path','nature reserve','botanical garden','seaside cliff'];

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE K  (3–5 sentences, simple vocabulary, animals & daily life)
// ═══════════════════════════════════════════════════════════════════════════════

function genK_pet(s) {
  const n  = pick(NAMES_K1, s);
  const p  = pick(['cat','dog','rabbit','hamster','turtle','bird','fish','bunny'], s+1);
  const a  = pick(['fluffy white','golden','tiny orange','soft gray','spotted','stripy brown','curly','small black'], s+2);
  const pl = pick(PLACES_K, s+3);
  const c  = `${n} has a ${a} ${p}. Every morning, ${n} gives the ${p} fresh food and water. After school, they play together in the ${pl}. The ${p} runs and jumps with joy. ${n} loves the ${p} very much.`;
  return { id:`k_pet_${s}`, grade:'K', title:`${n}'s ${cap(p)}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'fresh',meaning:'new and clean, not old',example:`${n} gives the ${p} fresh food.`},
      {word:'joy',meaning:'a feeling of being very happy',example:`The ${p} jumps with joy.`},
      {word:'loves',meaning:'cares about someone very much',example:`${n} loves the ${p}.`},
    ],
    questions:[
      {type:'mcq',question:`What does ${n} give the ${p} every morning?`,options:['Toys','Fresh food and water','A blanket','A bath'],answer:'Fresh food and water',explanation:`The story says ${n} gives the ${p} fresh food and water every morning.`},
      {type:'mcq',question:`Where do ${n} and the ${p} play together?`,options:['In the house',`In the ${pl}`,'At school','In the kitchen'],answer:`In the ${pl}`,explanation:`They play in the ${pl} after school.`},
      {type:'mcq',question:`How does ${n} feel about the ${p}?`,options:['Scared of it','Does not like it','Loves it very much','Is bored of it'],answer:'Loves it very much',explanation:`The last sentence says "${n} loves the ${p} very much."`},
      {type:'true_false',question:`${n} plays with the ${p} before school.`,options:['True','False'],answer:'False',explanation:`They play after school, not before school.`},
      {type:'true_false',question:`The ${p} is happy when playing.`,options:['True','False'],answer:'True',explanation:`The ${p} "runs and jumps with joy" — it is very happy!`},
      {type:'fill_blank',question:`${n} has a ${a} ___.`,answer:p,explanation:`The first sentence says "${n} has a ${a} ${p}."`},
    ]
  };
}

function genK_rainy(s) {
  const n  = pick(NAMES_K1, s*2);
  const r  = pick(RELATIVES, s);
  const d  = pick(['hot cocoa','warm soup','apple juice','warm milk','herbal tea'], s+1);
  const g  = pick(['a puzzle','a board game','drawing pictures','reading books','building blocks'], s+2);
  const c  = `Rain fell hard outside. ${n} looked out the window and saw big puddles on the ground. "${cap(n)}, come inside!" called ${n}'s ${r}. ${n}'s ${r} made ${d} for them both. They enjoyed ${g} all afternoon. When the sun came back out, ${n} smiled. It had been a cozy day.`;
  return { id:`k_rain_${s}`, grade:'K', title:`${n}'s Rainy Day`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'puddles',meaning:'small pools of water on the ground after rain',example:'There are big puddles outside after the rain.'},
      {word:'cozy',meaning:'warm, comfortable, and safe',example:'They had a cozy afternoon inside.'},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} see outside the window?`,options:['Snow','Big puddles','A rainbow','Birds'],answer:'Big puddles',explanation:`The story says ${n} saw "big puddles on the ground."`},
      {type:'mcq',question:`What did ${n} and ${r} do inside?`,options:['Watched TV',`Enjoyed ${g}`,'Cleaned the house','Cooked dinner'],answer:`Enjoyed ${g}`,explanation:`They enjoyed ${g} together all afternoon.`},
      {type:'mcq',question:`How was the day described at the end?`,options:['Boring','Scary','Cozy','Busy'],answer:'Cozy',explanation:`The last sentence says "It had been a cozy day."`},
      {type:'true_false',question:`${n} went outside to play in the rain.`,options:['True','False'],answer:'False',explanation:`${n} stayed inside with ${r} on the rainy day.`},
      {type:'true_false',question:`${n} was happy at the end of the day.`,options:['True','False'],answer:'True',explanation:`The story says "${n} smiled," which means ${n} was happy.`},
      {type:'fill_blank',question:`${n} and ${r} drank ___ together.`,answer:d,explanation:`The story says "${n}'s ${r} made ${d} for them both."`},
    ]
  };
}

function genK_school(s) {
  const n  = pick(NAMES_K1, s*3);
  const f  = pick(NAMES_K1, s*3+5);
  const su = pick(['painting','singing','counting','reading together','dancing'], s);
  const sn = pick(['an apple','crackers','a banana','orange slices','grapes'], s+1);
  const c  = `${n} woke up early for school. ${n} put on clothes and ate breakfast quickly. At school, ${n}'s teacher read a funny story aloud. The whole class laughed together. During ${su}, ${n} made something special for ${f}. At snack time, ${n} ate ${sn}. On the way home, ${n} thought, "I love school!"`;
  return { id:`k_school_${s}`, grade:'K', title:`${n}'s School Day`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'early',meaning:'before the usual time',example:`${n} woke up early for school.`},
      {word:'aloud',meaning:'spoken in a voice that others can hear',example:'The teacher read the story aloud.'},
      {word:'special',meaning:'different from usual, extra nice',example:`${n} made something special.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} do first in the morning?`,options:['Went to school','Woke up early','Ate lunch','Played with friends'],answer:'Woke up early',explanation:`The story says "${n} woke up early for school" — that is the very first thing.`},
      {type:'mcq',question:`What did the teacher do that made the class laugh?`,options:['Drew a picture','Read a funny story aloud','Sang a song','Played a game'],answer:'Read a funny story aloud',explanation:`The teacher read a funny story aloud and the whole class laughed.`},
      {type:'mcq',question:`How did ${n} feel about school?`,options:[`${n} was scared`,`${n} loved school`,`${n} was bored`,`${n} was tired`],answer:`${n} loved school`,explanation:`${n} thought "I love school!" on the way home.`},
      {type:'true_false',question:`The class felt sad during the funny story.`,options:['True','False'],answer:'False',explanation:`The class laughed — they were happy, not sad!`},
      {type:'true_false',question:`${n} made something for ${f} during ${su}.`,options:['True','False'],answer:'True',explanation:`The story says "${n} made something special for ${f}" during ${su}.`},
      {type:'fill_blank',question:`At snack time, ${n} ate ___.`,answer:sn,explanation:`The story says "At snack time, ${n} ate ${sn}."`},
    ]
  };
}

function genK_nature(s) {
  const n  = pick(NAMES_K1, s*4);
  const an = pick(['duckling','baby deer','squirrel','butterfly','frog','robin','hedgehog'], s);
  const h  = pick(['pond','forest','garden','field','lake','meadow'], s+1);
  const ac = pick(['dived into the water','hopped onto a leaf','flew to a flower','jumped high','sang sweetly','ran through the grass'], s+2);
  const r  = pick(RELATIVES, s+3);
  const c  = `One morning, ${n} walked to the ${h}. There was a little ${an} sitting on a rock. ${n} sat down quietly and watched. Slowly, the ${an} ${ac}. ${n} clapped softly with delight. The ${an} looked at ${n} and then went on its way. ${n} ran home to tell ${r} what they had seen.`;
  return { id:`k_nature_${s}`, grade:'K', title:`The ${cap(an)} by the ${cap(h)}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'quietly',meaning:'without making noise',example:`${n} sat down quietly to watch.`},
      {word:'slowly',meaning:'not fast, taking time',example:`The ${an} moved slowly.`},
      {word:'delight',meaning:'great happiness and pleasure',example:`${n} clapped with delight.`},
    ],
    questions:[
      {type:'mcq',question:`Where did ${n} go that morning?`,options:['To school','To the store',`To the ${h}`,"To a friend's house"],answer:`To the ${h}`,explanation:`The story says "${n} walked to the ${h}."`},
      {type:'mcq',question:`Where was the ${an} sitting?`,options:['In a tree','On a rock','In the water','On a leaf'],answer:'On a rock',explanation:`The story says "a little ${an} sitting on a rock."`},
      {type:'mcq',question:`What did ${n} do when the ${an} moved?`,options:['Ran away','Shouted loudly','Clapped softly','Fell asleep'],answer:'Clapped softly',explanation:`${n} clapped softly with delight.`},
      {type:'true_false',question:`${n} made a loud noise to scare the ${an}.`,options:['True','False'],answer:'False',explanation:`${n} sat quietly and clapped softly — very gentle!`},
      {type:'true_false',question:`${n} went home after seeing the ${an}.`,options:['True','False'],answer:'True',explanation:`The last sentence says "${n} ran home" after seeing the ${an}.`},
      {type:'fill_blank',question:`The ${an} was sitting on a ___.`,answer:'rock',explanation:`The story says the ${an} was "sitting on a rock."`},
    ]
  };
}

function genK_family(s) {
  const n  = pick(NAMES_K1, s);
  const r  = pick(['grandma','grandpa','aunt','uncle','kind neighbor'], s+1);
  const f  = pick(['apple pie','cookies','fresh bread','vegetable soup','pancakes'], s+2);
  const g  = pick(['a story','a funny song','a hug','a drawing','a poem'], s+3);
  const c  = `${n} loved to visit ${r}. ${r} always made ${f} for ${n}. They sat together at the kitchen table and ate it warm. Then ${r} shared ${g} with ${n}. ${n} listened with wide eyes. Before going home, ${n} said, "Thank you, ${r}. This was the best day!" ${r} smiled and gave ${n} a big hug.`;
  return { id:`k_family_${s}`, grade:'K', title:`${n} and ${cap(r)}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'warm',meaning:'slightly hot and comfortable',example:`They ate the ${f} warm.`},
      {word:'wide',meaning:'fully open, very open',example:`${n} listened with wide eyes.`},
      {word:'shared',meaning:'gave something to someone else to enjoy together',example:`${r} shared ${g} with ${n}.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${r} make for ${n}?`,options:['A toy',`${cap(f)}`,'A cake','Lemonade'],answer:`${cap(f)}`,explanation:`"${r} always made ${f} for ${n}."`},
      {type:'mcq',question:`Where did they eat together?`,options:['In the garden','At the kitchen table','On the sofa','Outside'],answer:'At the kitchen table',explanation:`They sat at the kitchen table to eat.`},
      {type:'mcq',question:`What did ${r} share with ${n} after eating?`,options:['More food','A toy',`${cap(g)}`,'A game'],answer:`${cap(g)}`,explanation:`After eating, ${r} shared ${g} with ${n}.`},
      {type:'true_false',question:`${n} did not enjoy visiting ${r}.`,options:['True','False'],answer:'False',explanation:`${n} said "This was the best day!" — clearly ${n} loved the visit.`},
      {type:'true_false',question:`${r} gave ${n} a hug before ${n} went home.`,options:['True','False'],answer:'True',explanation:`The last sentence says "${r} gave ${n} a big hug."`},
      {type:'fill_blank',question:`${n} listened to ${r} with ___ eyes.`,answer:'wide',explanation:`"${n} listened with wide eyes."`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE 1  (4–6 sentences, small stories, slightly richer vocabulary)
// ═══════════════════════════════════════════════════════════════════════════════

function genG1_skill(s) {
  const n  = pick(NAMES_K1, s);
  const sk = pick(['ride a bike','swim','bake cookies','fly a kite','play chess','do a cartwheel'], s+1);
  const h  = pick(['older sister','dad','mom','coach','neighbor','grandpa'], s+2);
  const fe = pick(['nervous','a little scared','excited but wobbly','unsure','anxious'], s+3);
  const c  = `${n} really wanted to learn to ${sk}. At first, ${n} felt ${fe}. ${n}'s ${h} held on and gave tips. ${n} tried again and again without giving up. Then one amazing moment — ${n} did it all by itself! ${n} let out a loud cheer. The ${h} smiled proudly and said, "I knew you could do it!"`;
  return { id:`g1_skill_${s}`, grade:'1', title:`${n} Learns to ${cap(sk.split(' ')[0])}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'nervous',meaning:'feeling worried before doing something new',example:`${n} felt nervous before trying.`},
      {word:'tips',meaning:'helpful advice or suggestions',example:`The ${h} gave ${n} useful tips.`},
      {word:'proudly',meaning:'feeling pleased about an achievement',example:`The ${h} smiled proudly.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} want to learn?`,options:[`To sing`,`To ${sk}`,`To cook`,`To paint`],answer:`To ${sk}`,explanation:`The first sentence says "${n} really wanted to learn to ${sk}."`},
      {type:'mcq',question:`How did ${n} finally succeed?`,options:['Got lucky','Stopped trying','Tried again and again','Asked someone else'],answer:'Tried again and again',explanation:`${n} "tried again and again without giving up" — that is why ${n} succeeded!`},
      {type:'mcq',question:`How did the ${h} feel at the end?`,options:['Angry','Sad','Proud','Bored'],answer:'Proud',explanation:`The ${h} "smiled proudly," which means the ${h} was very pleased.`},
      {type:'true_false',question:`${n} gave up when it got hard.`,options:['True','False'],answer:'False',explanation:`${n} tried "again and again without giving up" — ${n} did not quit!`},
      {type:'true_false',question:`${n} felt nervous at the beginning.`,options:['True','False'],answer:'True',explanation:`The story says ${n} felt nervous (or ${fe}) at first.`},
      {type:'fill_blank',question:`${n}'s ${h} said, "I knew you could ___ it!"`,answer:'do',explanation:`The ${h} said "I knew you could do it!"`},
    ]
  };
}

function genG1_garden(s) {
  const n  = pick(NAMES_K1, s*2);
  const pl = pick(['tomatoes','sunflowers','beans','strawberries','carrots','sweet peas'], s+1);
  const se = pick(SEASONS, s+2);
  const r  = pick(RELATIVES, s+3);
  const c  = `In ${se}, ${n} decided to grow ${pl} in the backyard. ${n}'s ${r} helped dig the soil and plant the tiny seeds. Every day, ${n} watered the patch and watched carefully. After many weeks, small green shoots appeared above the ground. They grew taller and stronger every day. When the ${pl} were finally ready, ${n} picked them and brought them to the kitchen. The whole family tried them at dinner and said they were delicious.`;
  return { id:`g1_garden_${s}`, grade:'1', title:`${n}'s ${cap(pl)} Patch`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'soil',meaning:'the top layer of earth where plants grow',example:`${n}'s ${r} helped dig the soil.`},
      {word:'shoots',meaning:'young plants just starting to grow above ground',example:'Small green shoots appeared.'},
      {word:'delicious',meaning:'tasting very good',example:`The ${pl} tasted delicious!`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} plant in the backyard?`,options:['Flowers','Trees',`${cap(pl)}`,'Grass'],answer:`${cap(pl)}`,explanation:`${n} planted ${pl} in the backyard.`},
      {type:'mcq',question:`What did ${n} do every day after planting?`,options:['Did nothing','Picked the plants','Watered the patch and watched','Dug more holes'],answer:'Watered the patch and watched',explanation:`${n} watered the patch and watched carefully every day.`},
      {type:'mcq',question:`What did the family say about the ${pl}?`,options:['Too small','Not good','They were delicious','Too many'],answer:'They were delicious',explanation:`The whole family said the ${pl} were delicious.`},
      {type:'true_false',question:`${n} grew the ${pl} alone without any help.`,options:['True','False'],answer:'False',explanation:`${n}'s ${r} helped dig the soil and plant the seeds.`},
      {type:'true_false',question:`The ${pl} grew slowly over many weeks.`,options:['True','False'],answer:'True',explanation:`The story says "After many weeks" the shoots appeared — it took time.`},
      {type:'fill_blank',question:`Small green ___ appeared above the ground after many weeks.`,answer:'shoots',explanation:`"Small green shoots appeared above the ground."`},
    ]
  };
}

function genG1_friend(s) {
  const n  = pick(NAMES_K1, s*3);
  const nf = pick(NAMES_K1, s*3+6);
  const sc = pick(['quiet and shy','brand new to the school','sitting alone at lunch','reading by herself','painting by himself'], s+1);
  const in_ = pick(['drawing comics','building with blocks','reading animal books','playing chess','writing stories'], s+2);
  const c  = `One day at school, ${n} noticed ${nf} was ${sc}. ${n} walked over and said hello. At first, ${nf} was a little nervous and did not say much. But when ${n} mentioned they both loved ${in_}, ${nf}'s face lit up with a big smile. They spent the whole lunch break talking about it. By the end of the day, they were already making plans to meet at the library after school. ${n} learned that being the first to say hello is all it takes to make a friend.`;
  return { id:`g1_friend_${s}`, grade:'1', title:`${n} Makes a New Friend`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'noticed',meaning:'saw and paid attention to something',example:`${n} noticed ${nf} was alone.`},
      {word:'nervous',meaning:'feeling worried or unsure',example:`${nf} felt nervous at first.`},
      {word:'mentioned',meaning:'said something briefly',example:`${n} mentioned they both loved ${in_}.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} notice about ${nf}?`,options:['A funny hat','A lost pet',`${nf} was ${sc}`,'A broken pencil'],answer:`${nf} was ${sc}`,explanation:`${n} noticed that ${nf} was ${sc}.`},
      {type:'mcq',question:`What did they both love that helped them connect?`,options:['Playing football','Eating lunch',`${cap(in_)}`,'Watching TV'],answer:`${cap(in_)}`,explanation:`When ${n} mentioned they both loved ${in_}, ${nf} smiled.`},
      {type:'mcq',question:`What is the lesson of this story?`,options:['Never talk to strangers','Libraries are fun','Being first to say hello starts a friendship','Lunch is important'],answer:'Being first to say hello starts a friendship',explanation:`The last sentence says "being the first to say hello is all it takes to make a friend."`},
      {type:'true_false',question:`${nf} was immediately comfortable when ${n} walked over.`,options:['True','False'],answer:'False',explanation:`At first, ${nf} "was a little nervous and did not say much."`},
      {type:'true_false',question:`${n} and ${nf} made plans to meet again.`,options:['True','False'],answer:'True',explanation:`They made plans to meet at the library after school.`},
      {type:'fill_blank',question:`When ${n} mentioned ${in_}, ${nf}'s face ___ with a big smile.`,answer:'lit up',explanation:`"${nf}'s face lit up with a big smile."`},
    ]
  };
}

function genG1_lost(s) {
  const n  = pick(NAMES_K1, s*4);
  const ob = pick(['lunch box','favourite book','science homework','pencil case','drawing pad','water bottle'], s+1);
  const pl = pick(['classroom coat closet','under the library table','behind the gym bleachers','in the art room','near the front door'], s+2);
  const he = pick(['teacher','librarian','janitor','school secretary','classmate'], s+3);
  const c  = `${n} could not find the ${ob} anywhere. ${n} searched the bag, the desk, and the hallway. Nothing. ${n} started to worry because the ${ob} was very important. A kind ${he} noticed ${n} looking upset and offered to help. Together they retraced every step ${n} had taken that day. At last they found the ${ob} in the ${pl}. ${n} felt a wave of relief and thanked the ${he} warmly. ${n} made a promise to always put things back in the same place.`;
  return { id:`g1_lost_${s}`, grade:'1', title:`${n} and the Missing ${cap(ob)}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'searched',meaning:'looked everywhere carefully for something',example:`${n} searched the bag for the ${ob}.`},
      {word:'retraced',meaning:'went back over the same path or steps',example:'They retraced every step taken.'},
      {word:'relief',meaning:'the happy feeling when a worry ends',example:`${n} felt a wave of relief.`},
    ],
    questions:[
      {type:'mcq',question:`What was ${n} looking for?`,options:['A friend',`A ${ob}`,'A pet','A library card'],answer:`A ${ob}`,explanation:`${n} could not find the ${ob}.`},
      {type:'mcq',question:`Who helped ${n} find the ${ob}?`,options:['A parent',`A ${he}`,'Another student alone','Nobody'],answer:`A ${he}`,explanation:`A kind ${he} noticed ${n} was upset and offered to help.`},
      {type:'mcq',question:`Where was the ${ob} found?`,options:['At home',`In the ${pl}`,'In the park','In the cafeteria'],answer:`In the ${pl}`,explanation:`They found the ${ob} in the ${pl}.`},
      {type:'true_false',question:`${n} found the ${ob} without any help.`,options:['True','False'],answer:'False',explanation:`A kind ${he} helped ${n} find the ${ob}.`},
      {type:'true_false',question:`${n} made a promise to be more careful.`,options:['True','False'],answer:'True',explanation:`${n} promised to always put things back in the same place.`},
      {type:'fill_blank',question:`${n} felt a wave of ___ when the ${ob} was found.`,answer:'relief',explanation:`"${n} felt a wave of relief."`},
    ]
  };
}

function genG1_weather(s) {
  const n  = pick(NAMES_K1, s);
  const r  = pick(RELATIVES, s+1);
  const ev = pick(['thunderstorm','hailstorm','heavy snowfall','tornado warning','flash flooding','ice storm'], s+2);
  const ac = pick(['hid under blankets','lit candles and played card games','made hot chocolate and sang songs','built a den out of cushions','read books by torchlight'], s+3);
  const c  = `The weather forecast warned of a big ${ev} that evening. ${n} and ${r} prepared the house together. They filled bottles with water and found extra blankets. When the ${ev} arrived, the lights flickered and went out. ${n} felt a little scared, but ${r} stayed calm. They ${ac} until the storm passed. When the sun came back, ${n} helped clean up the yard. "${r}, I am glad we faced it together," said ${n}.`;
  return { id:`g1_weather_${s}`, grade:'1', title:`The Night of the ${cap(ev)}`, content:c, difficulty:'easy', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'forecast',meaning:'a prediction of what the weather will be',example:'The weather forecast warned of a storm.'},
      {word:'prepared',meaning:'got ready for something before it happens',example:`${n} and ${r} prepared the house.`},
      {word:'flickered',meaning:'went on and off rapidly (for a light)',example:'The lights flickered when the storm hit.'},
    ],
    questions:[
      {type:'mcq',question:`What warned ${n} and ${r} about the ${ev}?`,options:['A neighbour','A TV show','The weather forecast','A loud noise'],answer:'The weather forecast',explanation:`"The weather forecast warned of a big ${ev}."`},
      {type:'mcq',question:`What happened to the lights during the ${ev}?`,options:['They got brighter','They stayed on','They flickered and went out','Nothing happened'],answer:'They flickered and went out',explanation:`"The lights flickered and went out."`},
      {type:'mcq',question:`What did ${n} and ${r} do while the storm lasted?`,options:['Slept through it','Went outside',`They ${ac}`,'Called for help'],answer:`They ${ac}`,explanation:`They ${ac} until the storm passed.`},
      {type:'true_false',question:`${n} felt calm during the whole storm.`,options:['True','False'],answer:'False',explanation:`${n} "felt a little scared" — but ${r} stayed calm.`},
      {type:'true_false',question:`${n} helped clean up after the storm.`,options:['True','False'],answer:'True',explanation:`When the sun came back, ${n} helped clean up the yard.`},
      {type:'fill_blank',question:`${n} said, "I am glad we ___ it together."`,answer:'faced',explanation:`${n} said "I am glad we faced it together."`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE 2  (6–8 sentences, characters with conflict and resolution)
// ═══════════════════════════════════════════════════════════════════════════════

function genG2_science(s) {
  const n  = pick(NAMES_23, s);
  const p  = pick(['measuring how much water plants need','testing which materials float','growing crystals from salt','tracking weather patterns','building a simple bridge with straws','testing which soil grows seeds fastest'], s+1);
  const pr = pick(['the results were unexpected','their notes were hard to read','one trial went completely wrong','the materials ran out','a measurement was incorrect','they ran out of time'], s+2);
  const te = pick(['Mr. Chen','Ms. Rivera','Dr. Park','Mrs. Osei','Professor Lin','Ms. Banerjee'], s+3);
  const c  = `${n} was excited about the class science project: ${p}. The first few days went well, but then ${pr}. ${n} felt like giving up. Instead, ${n} went back to the beginning and checked every step carefully. The problem was finally found and fixed. When ${n} presented the findings to the class, ${te} said, "This is exactly how real scientists work — mistakes help us learn." ${n} smiled and realised that a small setback had taught more than any textbook. The project earned the top mark in the class.`;
  return { id:`g2_sci_${s}`, grade:'2', title:`${n}'s Science Discovery`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'unexpected',meaning:'surprising; not what you predicted',example:'The results were unexpected.'},
      {word:'setback',meaning:'a problem or difficulty that slows you down',example:'A small setback taught ${n} something important.'},
      {word:'findings',meaning:'things discovered after testing or researching',example:`${n} presented the findings to the class.`},
    ],
    questions:[
      {type:'mcq',question:`What was ${n}'s science project about?`,options:['History','Writing poems',`${cap(p)}`,'Drawing maps'],answer:`${cap(p)}`,explanation:`The project was about ${p}.`},
      {type:'mcq',question:`What problem did ${n} face during the project?`,options:['Forgot to do it','Lost the project',`${cap(pr)}`,'Had no partner'],answer:`${cap(pr)}`,explanation:`The problem was that ${pr}.`},
      {type:'mcq',question:`What did ${te} say about ${n}'s method?`,options:['You cheated','Do it again','Mistakes help scientists learn','The project was wrong'],answer:'Mistakes help scientists learn',explanation:`${te} said "mistakes help us learn" — that is how real scientists work.`},
      {type:'true_false',question:`${n} gave up when the problem appeared.`,options:['True','False'],answer:'False',explanation:`${n} felt like giving up but instead went back and fixed the problem.`},
      {type:'true_false',question:`${n}'s project earned the top mark.`,options:['True','False'],answer:'True',explanation:`The last sentence says "The project earned the top mark in the class."`},
      {type:'fill_blank',question:`${te} said, "___ help us learn."`,answer:'Mistakes',explanation:`${te} said "Mistakes help us learn."`},
    ]
  };
}

function genG2_rescue(s) {
  const n  = pick(NAMES_23, s*2);
  const an = pick(['injured sparrow','small stray kitten','lost duckling','tangled butterfly','weak baby rabbit','young owl that had fallen'], s+1);
  const ac = pick(['gently carried it home in a box','wrapped it in a warm cloth','gave it water with a dropper','called the animal rescue centre','made it a safe nest in a shoebox','kept it warm by the window'], s+2);
  const ou = pick(['flew away strong and healthy','was returned to its family','was taken to a rescue centre','recovered and was released in the park','found a safe new home','grew strong and was freed'], s+3);
  const c  = `On the way home from school, ${n} spotted a ${an} near the gate. It could not move properly and looked frightened. Most people walked past without stopping. ${n} knelt down carefully and ${ac}. For three days, ${n} checked on the animal and made sure it was safe. ${n}'s parent helped contact the right experts. Eventually, the creature ${ou}. ${n} watched it go with mixed feelings — proud, and a little sad. That evening, ${n} wrote in a journal: "Sometimes one small act of kindness changes everything."`;
  return { id:`g2_rescue_${s}`, grade:'2', title:`${n} and the ${cap(an)}`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'frightened',meaning:'feeling fear; scared',example:'The animal looked frightened and could not move.'},
      {word:'experts',meaning:'people with a lot of knowledge and skill in an area',example:`${n}'s parent helped contact the right experts.`},
      {word:'kindness',meaning:'being caring, gentle, and helpful',example:'One small act of kindness changes everything.'},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} find near the gate?`,options:['A lost dog','A broken toy',`A ${an}`,'Money on the ground'],answer:`A ${an}`,explanation:`${n} spotted a ${an} near the gate.`},
      {type:'mcq',question:`What did most people do when they saw the animal?`,options:['Helped it','Took photos','Walked past without stopping','Called the police'],answer:'Walked past without stopping',explanation:`"Most people walked past without stopping."`},
      {type:'mcq',question:`What does the journal entry say at the end?`,options:['Animals are dangerous','Nature is beautiful','One small act of kindness changes everything','Experts are always right'],answer:'One small act of kindness changes everything',explanation:`${n} wrote "Sometimes one small act of kindness changes everything."`},
      {type:'true_false',question:`${n} ignored the ${an} like the others.`,options:['True','False'],answer:'False',explanation:`While others walked past, ${n} stopped and helped.`},
      {type:'true_false',question:`${n} felt only happy when the animal left.`,options:['True','False'],answer:'False',explanation:`${n} felt "mixed feelings — proud, and a little sad."`},
      {type:'fill_blank',question:`${n} wrote in a journal that one small act of ___ changes everything.`,answer:'kindness',explanation:`The journal said "one small act of kindness changes everything."`},
    ]
  };
}

function genG2_team(s) {
  const n1 = pick(NAMES_23, s);
  const n2 = pick(NAMES_23, s+7);
  const ch = pick(['build the tallest tower using only paper and tape','design a poster for the school fair','create a model of the solar system','cook a simple dish for the class','plan and plant a school herb garden','write and perform a short play'], s+2);
  const pr = pick(['they disagreed about the design','they ran out of materials halfway through','one partner got sick for a day','they had very different ideas','their first attempt collapsed','they misread the instructions'], s+3);
  const c  = `${n1} and ${n2} were paired together to ${ch}. At first they worked well, but then ${pr}. They argued for a while and nearly stopped speaking. Their teacher reminded them that the best teams listen to each other. ${n1} agreed to try ${n2}'s idea, and ${n2} agreed to try ${n1}'s approach too. Together they combined the best parts of both plans. The result was far better than either had imagined alone. When they presented their work, the whole class applauded. They both learned that two heads truly are better than one.`;
  return { id:`g2_team_${s}`, grade:'2', title:`${n1} and ${n2}: Better Together`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'paired',meaning:'matched with a partner for a task',example:`${n1} and ${n2} were paired together.`},
      {word:'argued',meaning:'disagreed in a heated way',example:'They argued for a while about the design.'},
      {word:'applauded',meaning:'clapped to show appreciation',example:'The whole class applauded their work.'},
    ],
    questions:[
      {type:'mcq',question:`What were ${n1} and ${n2} asked to do?`,options:['Write an essay',`${cap(ch)}`,'Run a race','Do maths homework'],answer:`${cap(ch)}`,explanation:`They were paired to ${ch}.`},
      {type:'mcq',question:`What problem did the partners face?`,options:['They forgot the assignment',`${cap(pr)}`,'They did not know the topic','They had no materials'],answer:`${cap(pr)}`,explanation:`The problem was that ${pr}.`},
      {type:'mcq',question:`What lesson did they both learn?`,options:['Working alone is easier','Teachers are always right','Two heads are better than one','Speed is most important'],answer:'Two heads are better than one',explanation:`They "learned that two heads truly are better than one."`},
      {type:'true_false',question:`${n1} and ${n2} easily agreed on everything.`,options:['True','False'],answer:'False',explanation:`They argued and nearly stopped speaking after ${pr}.`},
      {type:'true_false',question:`The result was better than either expected.`,options:['True','False'],answer:'True',explanation:`"The result was far better than either had imagined alone."`},
      {type:'fill_blank',question:`They both learned that two ___ are better than one.`,answer:'heads',explanation:`"They learned that two heads truly are better than one."`},
    ]
  };
}

function genG2_bake(s) {
  const n  = pick(NAMES_23, s*3);
  const fo = pick(['lemon tart','apple crumble','banana bread','vegetable soup','chocolate muffins','strawberry jam'], s+1);
  const oc = pick(['the oven was too hot','she added too much salt','the dough did not rise','the timer was forgotten','it tasted too sour','the mixture was too runny'], s+2);
  const c  = `${n} decided to make ${fo} for the family as a surprise. ${n} followed the recipe carefully, measuring every ingredient. But when it came out of the oven, something was wrong: ${oc}. ${n} felt embarrassed and thought about throwing it away. Instead, ${n} read the recipe again from the start and found the mistake. The second attempt was perfect. The whole family sat down together and enjoyed it. ${n}'s parent said, "The best cooks are not the ones who never make mistakes — they are the ones who learn from them."`;
  return { id:`g2_bake_${s}`, grade:'2', title:`${n}'s Kitchen Lesson`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'recipe',meaning:'a list of steps for making a food item',example:`${n} followed the recipe carefully.`},
      {word:'measuring',meaning:'finding out exactly how much of something is needed',example:'Measuring every ingredient helps you cook correctly.'},
      {word:'embarrassed',meaning:'feeling ashamed or awkward about a mistake',example:`${n} felt embarrassed when it went wrong.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} want to make for the family?`,options:['A sandwich',`${cap(fo)}`,'A birthday cake','Orange juice'],answer:`${cap(fo)}`,explanation:`${n} decided to make ${fo}.`},
      {type:'mcq',question:`What went wrong the first time?`,options:['No ingredients',`${cap(oc)}`,'The oven broke','Nothing went wrong'],answer:`${cap(oc)}`,explanation:`The problem was that ${oc}.`},
      {type:'mcq',question:`What did ${n}'s parent say about great cooks?`,options:['They never make mistakes','They are always fast','They learn from mistakes','They follow someone else'],answer:'They learn from mistakes',explanation:`The parent said "The best cooks learn from their mistakes."`},
      {type:'true_false',question:`${n} threw away the failed attempt.`,options:['True','False'],answer:'False',explanation:`${n} thought about it but instead read the recipe again and tried again.`},
      {type:'true_false',question:`The second attempt was a success.`,options:['True','False'],answer:'True',explanation:`"The second attempt was perfect."`},
      {type:'fill_blank',question:`${n} followed the ___ carefully.`,answer:'recipe',explanation:`"${n} followed the recipe carefully."`},
    ]
  };
}

function genG2_market(s) {
  const n1 = pick(NAMES_23, s);
  const n2 = pick(NAMES_23, s+4);
  const pr = pick(['homemade lemonade','beeswax candles','painted bookmarks','pressed flower cards','seed packets','handmade soap'], s+2);
  const pl = pick(['school market','neighbourhood fair','community picnic','Saturday market','church fundraiser','street stall'], s+3);
  const c  = `${n1} and ${n2} wanted to earn money for their class trip. They decided to sell ${pr} at the local ${pl}. Making the products took two weekends of hard work. On the day of the ${pl}, they set up a colourful display and smiled at everyone who walked by. At first business was slow, and they worried they would not sell enough. Then a small crowd gathered, and soon everything was sold. They counted their earnings and found they had more than enough for the trip — with extra for charity. The experience taught them that hard work and patience always pay off.`;
  return { id:`g2_market_${s}`, grade:'2', title:`${n1} and ${n2}'s Big Sale`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'earnings',meaning:'money made from doing work or selling things',example:'They counted their earnings carefully.'},
      {word:'patience',meaning:'staying calm while waiting; not giving up',example:'Hard work and patience always pay off.'},
      {word:'charity',meaning:'giving money or help to people in need',example:'They saved extra money for charity.'},
    ],
    questions:[
      {type:'mcq',question:`Why did ${n1} and ${n2} want to earn money?`,options:['To buy toys','For their class trip','To start a business','To give to a friend'],answer:'For their class trip',explanation:`They wanted to earn money for their class trip.`},
      {type:'mcq',question:`What did they sell at the ${pl}?`,options:['Old toys','Sandwiches',`${cap(pr)}`,'Raffle tickets'],answer:`${cap(pr)}`,explanation:`They sold ${pr} at the ${pl}.`},
      {type:'mcq',question:`What lesson did the experience teach them?`,options:['Selling is easy','Money is not important','Hard work and patience pay off','Only adults can sell things'],answer:'Hard work and patience pay off',explanation:`"The experience taught them that hard work and patience always pay off."`},
      {type:'true_false',question:`They sold everything quickly right from the start.`,options:['True','False'],answer:'False',explanation:`At first business was slow and they worried — then a crowd gathered.`},
      {type:'true_false',question:`They earned enough money and donated some to charity.`,options:['True','False'],answer:'True',explanation:`They had more than enough, with extra for charity.`},
      {type:'fill_blank',question:`They learned that hard work and ___ always pay off.`,answer:'patience',explanation:`"Hard work and patience always pay off."`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE 3  (7–9 sentences, deeper lessons, richer vocabulary)
// ═══════════════════════════════════════════════════════════════════════════════

function genG3_brave(s) {
  const n  = pick(NAMES_23, s);
  const fe = pick(['heights','public speaking','deep water','the dark','crossing a busy road alone','large crowds'], s+1);
  const me = pick(['coach','librarian','older cousin','science teacher','school counsellor','neighbour'], s+2);
  const ch = pick(['the ropes course at camp','speaking at the school assembly','the deep-end swimming test','a night hike without a torch','crossing the bridge to school','the crowded city tournament'], s+3);
  const c  = `For as long as ${n} could remember, ${n} had been afraid of ${fe}. The fear made ${n} avoid many things and feel left out. One day, ${n}'s ${me} noticed and quietly asked about it. Instead of making fun, the ${me} said, "Fear is not the enemy. Staying still is." Together, they made a small plan to face the fear step by step. On the day of ${ch}, ${n}'s heart pounded, but ${n} kept moving forward. At the final moment, ${n} pushed through and succeeded. Standing there afterwards, ${n} understood for the first time that bravery is not feeling no fear — it is moving forward despite it. From that day, the fear did not disappear entirely, but it no longer held ${n} back.`;
  return { id:`g3_brave_${s}`, grade:'3', title:`${n} Faces the Fear`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'avoid',meaning:'stay away from on purpose',example:`${n} would avoid anything to do with ${fe}.`},
      {word:'despite',meaning:'even though something is there',example:'${n} moved forward despite the fear.'},
      {word:'bravery',meaning:'willingness to face fear and danger',example:`${n} discovered what bravery really means.`},
    ],
    questions:[
      {type:'mcq',question:`What had ${n} always been afraid of?`,options:['Dogs',`${cap(fe)}`,'Loud music','Tests'],answer:`${cap(fe)}`,explanation:`${n} had always been afraid of ${fe}.`},
      {type:'mcq',question:`What did the ${me} say about fear?`,options:['Fear is your enemy','Ignore your fear','Fear is not the enemy — staying still is','Tell everyone your fear'],answer:'Fear is not the enemy — staying still is',explanation:`The ${me} said "Fear is not the enemy. Staying still is."`},
      {type:'mcq',question:`What is the true meaning of bravery according to the story?`,options:['Never feeling scared','Having no emotions','Feeling fear and moving forward anyway','Being the strongest person'],answer:'Feeling fear and moving forward anyway',explanation:`Bravery "is not feeling no fear — it is moving forward despite it."`},
      {type:'true_false',question:`${n}'s fear disappeared completely after that day.`,options:['True','False'],answer:'False',explanation:`The story says the fear "did not disappear entirely" — but it no longer held ${n} back.`},
      {type:'true_false',question:`The ${me} helped ${n} make a plan to face the fear.`,options:['True','False'],answer:'True',explanation:`Together, the ${me} and ${n} "made a small plan to face the fear step by step."`},
      {type:'fill_blank',question:`Bravery is moving forward ___ the fear, not the absence of it.`,answer:'despite',explanation:`"Bravery is moving forward despite it."`},
    ]
  };
}

function genG3_mystery(s) {
  const n  = pick(NAMES_23, s*2);
  const my = pick(['the classroom goldfish disappeared','a classmate\'s painting went missing','every pen in the art room turned purple','the school clock stopped at the same time every day','someone rearranged the library books overnight','every snack in the staff room was secretly replaced'], s+1);
  const cl = pick(['muddy footprints leading to the janitor\'s closet','a piece of purple thread near the window','a schedule that matched the strange timing','a note hidden inside a dictionary','a receipt for goldfish food in the recycling bin','an identical snack wrapper from a known shop'], s+2);
  const c  = `Something strange was happening at Maplewood School. ${cap(my)}. Nobody could explain it. ${n} decided to investigate like a detective. For three days, ${n} took notes, asked careful questions, and looked for patterns. Then ${n} found the key clue: ${cl}. Following the evidence step by step, ${n} uncovered the truth. It turned out to be a harmless misunderstanding — no villain, just a mix-up. The headteacher praised ${n} for the careful, logical thinking. ${n} realised that most mysteries are not magic — they are simply puzzles waiting for someone patient enough to solve them.`;
  return { id:`g3_myst_${s}`, grade:'3', title:`${n} Solves the Mystery`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'investigate',meaning:'look into something carefully to find the truth',example:`${n} decided to investigate like a detective.`},
      {word:'evidence',meaning:'information used to prove something',example:'Following the evidence led to the answer.'},
      {word:'logical',meaning:'based on clear, careful thinking and reasoning',example:`The headteacher praised ${n}'s logical thinking.`},
    ],
    questions:[
      {type:'mcq',question:`What mystery was ${n} trying to solve?`,options:['A missing pet at home','A maths problem',`The fact that ${my}`,'A lost key'],answer:`The fact that ${my}`,explanation:`The mystery was that ${my}.`},
      {type:'mcq',question:`What was the key clue ${n} found?`,options:['A secret door','A note from a teacher',`${cap(cl)}`,'A photograph'],answer:`${cap(cl)}`,explanation:`The key clue was ${cl}.`},
      {type:'mcq',question:`What did the mystery turn out to be?`,options:['A crime','A ghost story','A harmless misunderstanding','An unsolved puzzle'],answer:'A harmless misunderstanding',explanation:`It turned out to be "a harmless misunderstanding — no villain, just a mix-up."`},
      {type:'true_false',question:`${n} solved the mystery by guessing randomly.`,options:['True','False'],answer:'False',explanation:`${n} took notes, asked questions, and followed the evidence carefully.`},
      {type:'true_false',question:`The headteacher praised ${n}'s thinking.`,options:['True','False'],answer:'True',explanation:`"The headteacher praised ${n} for the careful, logical thinking."`},
      {type:'fill_blank',question:`Most mysteries are not magic — they are ___ waiting to be solved.`,answer:'puzzles',explanation:`"Most mysteries are simply puzzles waiting for someone patient enough to solve them."`},
    ]
  };
}

function genG3_community(s) {
  const n  = pick(NAMES_23, s*3);
  const pr = pick(['the local park was full of litter','the community garden had been abandoned','an elderly neighbour could not carry groceries','a bus shelter had been vandalised','the school wall was covered in graffiti','the town pond had too much algae'], s+1);
  const so = pick(['organised a weekly cleanup team','raised money to replant it','started a grocery delivery rota','helped repaint it with permission','led a painting project to improve it','campaigned for a water quality test'], s+2);
  const c  = `${n} noticed that ${pr}. It bothered ${n} every single day. Most adults shrugged and said, "Someone else will fix it." But ${n} thought, "Why not me?" With determination, ${n} ${so}. At first, very few people joined. But ${n} kept going back, kept asking, and kept showing up. Slowly, neighbours began to notice and help. Within two months, the problem was transformed. The mayor came to see the change and thanked ${n} personally. ${n} told the local newspaper: "Communities are not just places. They are people choosing to care about each other." The story was printed on the front page.`;
  return { id:`g3_comm_${s}`, grade:'3', title:`${n} Changes the Community`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'determination',meaning:'a strong decision not to give up',example:`With determination, ${n} set to work.`},
      {word:'transformed',meaning:'changed completely into something much better',example:'Within two months, the problem was transformed.'},
      {word:'community',meaning:'a group of people living in the same area',example:'Communities are people choosing to care.'},
    ],
    questions:[
      {type:'mcq',question:`What problem did ${n} notice?`,options:['A broken window','A missing teacher',`The fact that ${pr}`,'A flood in the street'],answer:`The fact that ${pr}`,explanation:`${n} noticed that ${pr}.`},
      {type:'mcq',question:`What did most adults say about the problem?`,options:['"Let us fix it now"','"It is too big"','"Someone else will fix it"','"Call the police"'],answer:'"Someone else will fix it"',explanation:`Most adults said "Someone else will fix it."`},
      {type:'mcq',question:`What did ${n} tell the newspaper?`,options:['I did it alone','Everyone was lazy','Communities are people choosing to care','The mayor helped me'],answer:'Communities are people choosing to care',explanation:`${n} said "Communities are people choosing to care about each other."`},
      {type:'true_false',question:`${n} gave up when few people joined at first.`,options:['True','False'],answer:'False',explanation:`${n} "kept going back, kept asking, and kept showing up" despite few helpers at first.`},
      {type:'true_false',question:`${n}'s story was printed in the newspaper.`,options:['True','False'],answer:'True',explanation:`"The story was printed on the front page."`},
      {type:'fill_blank',question:`${n} said that communities are people choosing to ___ about each other.`,answer:'care',explanation:`"Communities are people choosing to care about each other."`},
    ]
  };
}

function genG3_invention(s) {
  const n  = pick(NAMES_23, s*4);
  const pr = pick(['her elderly grandparent struggled to open jar lids','the school bins were always knocked over by wind','young children could not reach the water fountain','the classroom lights were left on every night','heavy school bags were hurting children\'s backs','the garden hose kept kinking and stopping water flow'], s+1);
  const in_ = pick(['a jar-opening tool with a rubber grip','a weighted bin with a locking lid','an adjustable step system near the fountain','an automatic light switch triggered by motion','a modular lightweight bag frame','a smooth-flow hose reel with a no-kink design'], s+2);
  const c  = `${n} had an eye for problems that others ignored. When ${n} saw that ${pr}, ${n} did not complain — ${n} started drawing. For weeks, the sketchbook was filled with designs, crossed-out ideas, and fresh attempts. ${n} tested prototypes made from cardboard and tape. Several failed. One worked — just a little. ${n} kept improving it until it really worked well. The invention was a ${in_}. ${n} entered it in the school invention fair and won first place. But the greater prize was the lesson: every great invention begins with someone who noticed a small problem and refused to walk past it.`;
  return { id:`g3_invent_${s}`, grade:'3', title:`${n}'s Invention`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'prototypes',meaning:'early test versions of something being built',example:`${n} tested prototypes made from cardboard.`},
      {word:'designs',meaning:'plans drawn out showing how something will be built',example:'The sketchbook was filled with designs.'},
      {word:'invention',meaning:'something new created to solve a problem',example:`The ${in_} was ${n}'s invention.`},
    ],
    questions:[
      {type:'mcq',question:`What problem did ${n} notice?`,options:['A maths error','A broken computer',`The fact that ${pr}`,'A spelling mistake'],answer:`The fact that ${pr}`,explanation:`${n} noticed that ${pr}.`},
      {type:'mcq',question:`What did ${n} invent?`,options:['A robot','A new language',`A ${in_}`,'A game app'],answer:`A ${in_}`,explanation:`The invention was a ${in_}.`},
      {type:'mcq',question:`What is the greater lesson the story teaches?`,options:['Inventions need factories','Only adults can invent','Every invention begins with noticing a small problem','Science is too hard'],answer:'Every invention begins with noticing a small problem',explanation:`The story ends with "every great invention begins with someone who noticed a small problem."`},
      {type:'true_false',question:`${n}'s first prototype worked perfectly.`,options:['True','False'],answer:'False',explanation:`"Several failed. One worked — just a little." ${n} kept improving it.`},
      {type:'true_false',question:`${n} won first place at the school invention fair.`,options:['True','False'],answer:'True',explanation:`${n} entered the invention fair "and won first place."`},
      {type:'fill_blank',question:`Every great invention begins with someone who noticed a ___ problem.`,answer:'small',explanation:`"Every great invention begins with someone who noticed a small problem."`},
    ]
  };
}

function genG3_nature(s) {
  const n  = pick(NAMES_23, s);
  const sp = pick(['endangered hedgehogs','declining bee population','disappearing wildflowers','migrating birds losing their path','rare pond plants','ancient trees being cut down'], s+1);
  const ac = pick(['planted a wildflower strip at school','built insect hotels from bamboo and pine cones','created a bird corridor with native shrubs','set up a bat box and tracking chart','restored the pond edges with native reeds','started a tree-planting campaign with local businesses'], s+2);
  const c  = `${n} learned in science class that ${sp} were under threat in the local area. Most classmates moved on to the next lesson, but ${n} could not stop thinking about it. That weekend, ${n} researched the issue online and at the library. ${n} wrote to a local environmental group and received a reply with advice and seed packets. Working with three friends and a willing teacher, ${n} ${ac}. Progress was slow, but steady. By the end of term, the school had become a registered wildlife-friendly site. The science teacher told the class: "Environmental problems can seem huge, but every solution starts somewhere small."`;
  return { id:`g3_nature_${s}`, grade:'3', title:`${n} Protects Nature`, content:c, difficulty:'medium', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'endangered',meaning:'at serious risk of disappearing from the world',example:`The ${sp.split(' ')[1]} were endangered.`},
      {word:'environmental',meaning:'relating to the natural world and its protection',example:'They joined an environmental group.'},
      {word:'registered',meaning:'officially listed or recognised',example:'The school became a registered wildlife-friendly site.'},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} learn was under threat?`,options:['The school','A park bench',`${cap(sp)}`,'A local river'],answer:`${cap(sp)}`,explanation:`${n} learned that ${sp} were under threat.`},
      {type:'mcq',question:`What did ${n} do after learning about the problem?`,options:['Ignored it','Forgot it','Researched it and took action','Asked an adult to do it'],answer:'Researched it and took action',explanation:`${n} researched the issue and eventually ${ac}.`},
      {type:'mcq',question:`What did the school become by end of term?`,options:['A science museum','A nature park','A registered wildlife-friendly site','A charity'],answer:'A registered wildlife-friendly site',explanation:`"The school had become a registered wildlife-friendly site."`},
      {type:'true_false',question:`${n} worked entirely alone on this project.`,options:['True','False'],answer:'False',explanation:`${n} worked with three friends and a willing teacher.`},
      {type:'true_false',question:`The science teacher said every solution starts somewhere small.`,options:['True','False'],answer:'True',explanation:`The teacher said "every solution starts somewhere small."`},
      {type:'fill_blank',question:`By end of term, the school had become a registered ___ site.`,answer:'wildlife-friendly',explanation:`The school became a registered wildlife-friendly site.`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE 4  (9–11 sentences, complex themes, advanced vocabulary)
// ═══════════════════════════════════════════════════════════════════════════════

function genG4_science(s) {
  const n  = pick(NAMES_45, s);
  const q  = pick(['why the local river turned brown every summer','what makes certain soils grow crops better','why bees were disappearing from the town park','how microplastics entered the school water supply','what caused the strange discolouration of pond water','why one side of the school hill had no wildflowers'], s+1);
  const me = pick(['collected water samples at ten points along the river','tested four soil types using identical plant experiments','tracked bee activity with hourly counts over six weeks','filtered tap water samples and tested each chemically','compared pond samples under a microscope over three months','measured sunlight, soil moisture, and species at each zone'], s+2);
  const di = pick(['elevated nitrogen levels near the old factory','a significant difference in pH and mineral content','a correlation with a nearby pesticide spray schedule','traces of a plastic compound used in the school\'s old pipes','a bacterial bloom triggered by warm weather and fertiliser runoff','a difference in drainage that blocked seed germination on one side'], s+3);
  const c  = `${n} had always been curious about the natural world, but a nagging question turned into a full investigation: ${q}? Armed with a notebook and determination, ${n} ${me}. The work was painstaking — some tests had to be repeated three times to confirm the results. After six weeks of careful data collection, a pattern emerged. The data pointed clearly to ${di}. ${n} compiled the findings into a formal twenty-page report, complete with charts and photographs. The report was submitted to the town council and the local university. A professor responded personally, calling it "one of the most methodical investigations I have seen from a student of any age." The council agreed to investigate the source. ${n} realised that science is not about having the answers first — it is about asking the right question and following the evidence honestly wherever it leads.`;
  return { id:`g4_sci_${s}`, grade:'4', title:`${n}'s Field Investigation`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'painstaking',meaning:'done with very careful effort and attention',example:'The work was painstaking but worth it.'},
      {word:'methodical',meaning:'done in a careful, orderly, and systematic way',example:`The professor called it "methodical."`},
      {word:'correlation',meaning:'a connection or relationship between two things',example:'There was a correlation between the results.'},
      {word:'compiled',meaning:'collected and organised information into one document',example:`${n} compiled the findings into a report.`},
    ],
    questions:[
      {type:'mcq',question:`What was the central question of ${n}'s investigation?`,options:['How to win a science fair','What makes rain fall',`${cap(q)}`,'How to build a robot'],answer:`${cap(q)}`,explanation:`${n}'s investigation focused on ${q}.`},
      {type:'mcq',question:`What did ${n} discover through the investigation?`,options:['Nothing unusual','An error in textbooks',`${cap(di)}`,'A new species'],answer:`${cap(di)}`,explanation:`The data pointed to ${di}.`},
      {type:'mcq',question:`What did the professor say about ${n}'s report?`,options:['It was incomplete','It was confusing','It was one of the most methodical investigations ever seen from a student','It needed more data'],answer:'It was one of the most methodical investigations ever seen from a student',explanation:`The professor called it "one of the most methodical investigations I have seen from a student of any age."`},
      {type:'true_false',question:`${n} only ran each test once to save time.`,options:['True','False'],answer:'False',explanation:`"Some tests had to be repeated three times to confirm the results."`},
      {type:'true_false',question:`${n}'s report reached both the town council and a university.`,options:['True','False'],answer:'True',explanation:`The report was submitted to the town council and the local university.`},
      {type:'fill_blank',question:`Science is about following the ___ honestly wherever it leads.`,answer:'evidence',explanation:`${n} realised science is about "following the evidence honestly wherever it leads."`},
    ]
  };
}

function genG4_history(s) {
  const n  = pick(NAMES_45, s*2);
  const hi = pick(['the printing press','the first public library in their city','the women\'s suffrage movement in their country','the abolition of child labour laws','the first transatlantic telegraph cable','the invention of vaccination'], s+1);
  const le = pick(['that one person\'s idea can change millions of lives','that progress often comes from people willing to be unpopular','that small actions accumulate into historical change','that technology and society always influence each other','that the fight for rights is never truly finished','that science and courage together can reshape the world'], s+2);
  const c  = `During a school history project, ${n} chose to research ${hi}. Most classmates picked famous battles or famous rulers. ${n} was drawn to something less obvious — a change that had altered everyday life quietly but profoundly. The research took ${n} to three different libraries and seventeen different sources. ${n} discovered stories of people whose names are rarely mentioned in textbooks, but without whom the change would not have happened. ${n} created a detailed timeline and a multimedia presentation. When presenting to the class, ${n} said: "History is not only made by famous people. It is made by all the ordinary people who decided that something had to change." The presentation sparked a class debate that lasted two periods. ${n} left with a clear understanding: ${le}.`;
  return { id:`g4_hist_${s}`, grade:'4', title:`${n} Discovers History`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'profoundly',meaning:'in a deep and far-reaching way',example:`${hi} changed everyday life profoundly.`},
      {word:'accumulated',meaning:'built up over time through many small steps',example:'Historical change accumulates from small actions.'},
      {word:'multimedia',meaning:'using several different types of media (text, images, video)',example:`${n} created a multimedia presentation.`},
      {word:'sparked',meaning:'caused something to begin',example:`The presentation sparked a lively debate.`},
    ],
    questions:[
      {type:'mcq',question:`What historical topic did ${n} research?`,options:['A famous battle','A royal family',`${cap(hi)}`,'An ancient civilisation'],answer:`${cap(hi)}`,explanation:`${n} chose to research ${hi}.`},
      {type:'mcq',question:`What did ${n} discover about the people involved in the change?`,options:['They were all famous','They were all royalty','Their names are rarely in textbooks but they were essential','They were scientists only'],answer:'Their names are rarely in textbooks but they were essential',explanation:`${n} found stories of people "whose names are rarely mentioned in textbooks, but without whom the change would not have happened."`},
      {type:'mcq',question:`What key lesson did ${n} take away?`,options:['Only leaders matter',`${cap(le)}`,'History is boring','Technology changes nothing'],answer:`${cap(le)}`,explanation:`${n} left with the understanding that ${le}.`},
      {type:'true_false',question:`${n} chose a topic about a famous battle or ruler like most classmates.`,options:['True','False'],answer:'False',explanation:`${n} chose ${hi}, something "less obvious" than battles or rulers.`},
      {type:'true_false',question:`${n}'s presentation caused a class debate.`,options:['True','False'],answer:'True',explanation:`"The presentation sparked a class debate that lasted two periods."`},
      {type:'fill_blank',question:`${n} said history is made by ordinary people who decided something had to ___.`,answer:'change',explanation:`${n} said history is made by people who "decided that something had to change."`},
    ]
  };
}

function genG4_environment(s) {
  const n  = pick(NAMES_45, s*3);
  const pr = pick(['a coral reef bleaching event','a wildfire moving toward a nature reserve','a factory dumping chemicals into the wetlands','a glacier retreating faster each year','an invasive plant species crowding out native wildlife','a drought destroying the town\'s bird sanctuary'], s+1);
  const ac = pick(['documented the damage with photographs and GPS data','organised a petition signed by three hundred residents','presented a scientific case to the regional environmental board','raised funds to plant a buffer zone of native trees','partnered with a university research team to monitor the situation','created a public campaign that reached national media'], s+2);
  const c  = `When ${n} first learned about ${pr}, the scale of the problem felt overwhelming. It would have been easy to feel powerless. Instead, ${n} spent two months learning everything available about the issue. ${n} contacted environmental scientists, read policy documents, and interviewed affected residents. Then ${n} ${ac}. The process was slow and filled with obstacles. Officials were sometimes dismissive. Progress seemed invisible. But ${n} kept records, stayed focused, and kept connecting with others who cared. Eighteen months after starting, a concrete policy change was made by the regional authority — directly citing ${n}'s documented evidence. In an interview, ${n} said: "The hardest part was not the work itself. It was learning to be patient enough for change to come at its own pace."`;
  return { id:`g4_env_${s}`, grade:'4', title:`${n} Fights for the Environment`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'overwhelming',meaning:'so large or difficult it feels impossible to deal with',example:'The scale of the problem felt overwhelming.'},
      {word:'dismissive',meaning:'treating something as not important or serious',example:'Officials were sometimes dismissive of the concerns.'},
      {word:'policy',meaning:'an official rule or plan made by an organisation or government',example:'A concrete policy change was made.'},
      {word:'citing',meaning:'mentioning or referring to something as evidence',example:`The authority cited ${n}'s evidence.`},
    ],
    questions:[
      {type:'mcq',question:`What environmental problem was ${n} addressing?`,options:['Littering at school','Loud noise in town',`${cap(pr)}`,'Traffic jams'],answer:`${cap(pr)}`,explanation:`${n} was addressing ${pr}.`},
      {type:'mcq',question:`What did ${n} do to tackle the problem?`,options:['Gave up','Wrote a poem','Waited for adults',`${cap(ac)}`],answer:`${cap(ac)}`,explanation:`${n} ${ac}.`},
      {type:'mcq',question:`What did ${n} say was the hardest part?`,options:['Doing the research','Talking to scientists','Being patient enough for change to come','Writing the report'],answer:'Being patient enough for change to come',explanation:`${n} said "The hardest part was... learning to be patient enough for change to come at its own pace."`},
      {type:'true_false',question:`The policy change happened immediately after ${n} started.`,options:['True','False'],answer:'False',explanation:`The policy change came "eighteen months after starting" — it was a long process.`},
      {type:'true_false',question:`${n}'s documented evidence was officially cited in the policy change.`,options:['True','False'],answer:'True',explanation:`The authority made a change "directly citing ${n}'s documented evidence."`},
      {type:'fill_blank',question:`${n} said the hardest part was being ___ enough for change to come.`,answer:'patient',explanation:`"The hardest part was... learning to be patient enough for change to come at its own pace."`},
    ]
  };
}

function genG4_problem(s) {
  const n  = pick(NAMES_45, s*4);
  const is = pick(['students from the newer part of town were left out of after-school clubs','the school library had almost no books in languages other than English','younger children had no safe place to play at break time','children with disabilities could not access the main activity area','the school canteen served no food that many students could eat','many students could not afford the materials for the school trip'], s+1);
  const so = pick(['started an inclusive club calendar with sliding-scale fees','applied for a multilingual book grant and organised a donation drive','designed and built a small sheltered play space using recycled wood','drew up an accessibility proposal that the school board adopted','created a rotating weekly menu that reflected the whole school community','established a school equipment-lending library with donated resources'], s+2);
  const c  = `${n} paid close attention to what happened around school that others seemed to miss. One thing stood out clearly: ${is}. It seemed unfair, but most people treated it as normal. ${n} refused to accept that "normal" meant "right." After interviewing affected students and researching similar solutions from other schools, ${n} ${so}. The proposal was politely rejected twice before finally being accepted on the third presentation — with small adjustments. The change affected over sixty students in the first year. The school won a regional inclusion award. ${n} reflected quietly: "The most unjust situations are often the ones that everyone has stopped noticing. That is exactly when someone needs to start."`;
  return { id:`g4_social_${s}`, grade:'4', title:`${n} Stands for Fairness`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'inclusion',meaning:'making sure everyone can participate and belong',example:'The school won a regional inclusion award.'},
      {word:'unjust',meaning:'unfair; not right or equal',example:`${n} said the most unjust situations are ones people stop noticing.`},
      {word:'proposal',meaning:'a formal written suggestion or plan',example:`${n}'s proposal was rejected twice before being accepted.`},
      {word:'adjusted',meaning:'changed slightly to improve something',example:'The proposal was accepted with small adjustments.'},
    ],
    questions:[
      {type:'mcq',question:`What unfair situation did ${n} notice?`,options:['A bad lesson','A broken window',`That ${is}`,'Noisy classrooms'],answer:`That ${is}`,explanation:`${n} noticed that ${is}.`},
      {type:'mcq',question:`What did ${n} do to fix the situation?`,options:['Complained to parents','Ignored it',`${cap(so)}`,'Left the school'],answer:`${cap(so)}`,explanation:`${n} ${so}.`},
      {type:'mcq',question:`What did ${n} say about unjust situations?`,options:['They fix themselves','They are too big to solve','The most unjust ones are those everyone stopped noticing','Only adults can solve them'],answer:'The most unjust ones are those everyone stopped noticing',explanation:`${n} said "The most unjust situations are often the ones that everyone has stopped noticing."`},
      {type:'true_false',question:`${n}'s proposal was accepted on the first try.`,options:['True','False'],answer:'False',explanation:`The proposal "was politely rejected twice before finally being accepted on the third presentation."`},
      {type:'true_false',question:`The school won an award for inclusion after the change.`,options:['True','False'],answer:'True',explanation:`"The school won a regional inclusion award."`},
      {type:'fill_blank',question:`${n} said that when everyone stops ___, that is exactly when someone needs to start.`,answer:'noticing',explanation:`"Everyone has stopped noticing. That is exactly when someone needs to start."`},
    ]
  };
}

function genG4_adventure(s) {
  const n1 = pick(NAMES_45, s);
  const n2 = pick(NAMES_45, s+5);
  const se = pick(['a mountain rescue trail','an unmapped coastal path','an old abandoned mine route','a flooded forest track','a remote island with no mobile signal','a desert canyon with no shade'], s+2);
  const cr = pick(['the trail map was wrong','they ran out of water sooner than expected','a sudden weather change cut off the return path','a bridge had collapsed since the map was printed','one of them twisted an ankle far from help','their compass failed in the mineral-rich rock'], s+3);
  const c  = `${n1} and ${n2} had prepared for months before setting out on ${se}. They had studied maps, packed emergency supplies, and briefed a trusted adult on their route. On day two, however, ${cr}. Panic was the first instinct. But ${n1} said quietly: "We do not have the luxury of panic right now." Together they assessed what they had, what they knew, and what options remained. Step by step, using their training and mutual trust, they navigated to safety. It took two extra days and considerable discomfort, but they arrived without serious injury. In their joint report to the expedition organisation afterwards, they wrote: "The wilderness does not punish the unprepared. It simply makes preparation visible." Both vowed to use the experience to mentor younger adventurers.`;
  return { id:`g4_adv_${s}`, grade:'4', title:`${n1} and ${n2}: Tested in the Wild`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'assessed',meaning:'carefully judged or evaluated a situation',example:'They assessed what options remained.'},
      {word:'mutual',meaning:'shared by both or all people involved',example:'Their mutual trust helped them navigate.'},
      {word:'navigated',meaning:'found the right path through a difficult place',example:`They navigated to safety step by step.`},
      {word:'expedition',meaning:'a journey with a specific purpose, often into wild terrain',example:'They reported to the expedition organisation.'},
    ],
    questions:[
      {type:'mcq',question:`What unexpected problem did ${n1} and ${n2} face?`,options:['They got bored',`${cap(cr)}`,'It started raining lightly','They forgot their food'],answer:`${cap(cr)}`,explanation:`The crisis was that ${cr}.`},
      {type:'mcq',question:`What did ${n1} say when panic set in?`,options:['"Let\'s go back"','"We are lost"','"We do not have the luxury of panic right now"','"Call for help"'],answer:'"We do not have the luxury of panic right now"',explanation:`${n1} said "We do not have the luxury of panic right now."`},
      {type:'mcq',question:`What did they write in their report about preparation?`,options:['Preparation is overrated','The wilderness punishes everyone','The wilderness makes preparation visible','Only experts should explore'],answer:'The wilderness makes preparation visible',explanation:`They wrote "The wilderness does not punish the unprepared. It simply makes preparation visible."`},
      {type:'true_false',question:`${n1} and ${n2} were completely unprepared for the expedition.`,options:['True','False'],answer:'False',explanation:`They had "prepared for months" — studied maps, packed supplies, and briefed an adult.`},
      {type:'true_false',question:`They arrived safely despite the extra time and discomfort.`,options:['True','False'],answer:'True',explanation:`"They arrived without serious injury" after two extra days.`},
      {type:'fill_blank',question:`They vowed to use their experience to ___ younger adventurers.`,answer:'mentor',explanation:`"Both vowed to use the experience to mentor younger adventurers."`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRADE 5  (10–12 sentences, ethical depth, nuanced moral)
// ═══════════════════════════════════════════════════════════════════════════════

function genG5_choice(s) {
  const n  = pick(NAMES_45, s);
  const di = pick(['whether to report a close friend who had cheated in the national exam','whether to tell the truth about an accident that would get a teammate suspended','whether to share a classmate\'s secret to save another person from harm','whether to claim credit for a group project when the others had done less work','whether to return a wallet full of money found on the way to an important match','whether to tell a teacher about bullying when doing so might make things worse'], s+1);
  const ch = pick(['told the truth, even knowing it would hurt the friendship','remained silent at first, but found a private way to fix the harm','shared the secret only with the person it was meant to protect','gave everyone equal credit, publicly naming each contribution','returned the wallet immediately without telling anyone','reported the bullying anonymously and then supported the victim privately'], s+2);
  const c  = `${n} had always believed that right and wrong were simple. That changed the day ${n} faced a genuine dilemma: ${di}. The easy answer and the right answer were not the same. ${n} spent three sleepless nights turning the problem over, considering every perspective — the friend, the stranger, the institution, and ${n}'s own future self. In the end, ${n} ${ch}. It was not received perfectly. There were consequences — some expected, one surprising. But ${n} found that living with the outcome of a genuinely considered choice was far easier than living with the weight of having chosen convenience over conscience. Months later, the person most affected thanked ${n} in a short note. It read: "I did not understand what you did then. I do now." ${n} kept the note. Some decisions shape us more than any lesson ever could.`;
  return { id:`g5_choice_${s}`, grade:'5', title:`${n}'s Hardest Choice`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'dilemma',meaning:'a situation where you must choose between two difficult options',example:`${n} faced a genuine dilemma.`},
      {word:'conscience',meaning:'the inner feeling of what is right and wrong',example:'${n} chose conscience over convenience.'},
      {word:'consequences',meaning:'results that follow from an action or decision',example:'There were consequences — some expected, one surprising.'},
      {word:'perspective',meaning:'a particular point of view or way of seeing something',example:`${n} considered every perspective.`},
    ],
    questions:[
      {type:'mcq',question:`What kind of situation did ${n} face?`,options:['A maths problem','A sports challenge',`A genuine dilemma about ${di.split(' ').slice(0,5).join(' ')}...`,'A geography quiz'],answer:`A genuine dilemma about ${di.split(' ').slice(0,5).join(' ')}...`,explanation:`${n} faced a genuine dilemma: ${di}.`},
      {type:'mcq',question:`What did ${n} discover about easy answers vs right answers?`,options:['They are always the same','Easy is usually right','They are often not the same','Right is always easy'],answer:'They are often not the same',explanation:`"The easy answer and the right answer were not the same."`},
      {type:'mcq',question:`What did the note from the affected person say?`,options:['"You were wrong"','"Thank you, I always understood"','"I did not understand then, I do now"','"Please forgive me"'],answer:'"I did not understand then, I do now"',explanation:`The note read: "I did not understand what you did then. I do now."`},
      {type:'true_false',question:`${n} made the decision quickly and easily.`,options:['True','False'],answer:'False',explanation:`${n} "spent three sleepless nights turning the problem over."`},
      {type:'true_false',question:`${n} kept the note as something meaningful.`,options:['True','False'],answer:'True',explanation:`"${n} kept the note." — it was clearly important.`},
      {type:'fill_blank',question:`${n} chose ___ over convenience.`,answer:'conscience',explanation:`${n} chose "conscience over convenience."`},
    ]
  };
}

function genG5_change(s) {
  const n  = pick(NAMES_45, s*2);
  const in_ = pick(['the school\'s gifted programme admitted students only from wealthier neighbourhoods','the local history curriculum completely erased the contribution of women','the town\'s only community centre was about to be demolished for car parking','the school newspaper had been shut down for printing uncomfortable truths','the science programme had no equipment for students with visual impairments','the region\'s oral storytelling tradition was disappearing with its elder speakers'], s+1);
  const ac = pick(['spent a year documenting the admission data and presenting it to the education board','co-authored an alternative curriculum unit adopted by four local schools','led a conservation campaign that collected four thousand signatures','relaunched the newspaper under a different name and legal protection','designed and funded a tactile science kit adopted district-wide','recorded thirty-two hours of stories from seven elders and built an online archive'], s+2);
  const c  = `From the outside, ${n} seemed like an ordinary student. Inside, ${n} carried a persistent discomfort: ${in_}. Others acknowledged the problem politely but did nothing. ${n} decided that acknowledgement without action was its own form of complicity. Working methodically over eighteen months, ${n} ${ac}. Every step faced resistance: bureaucracy, indifference, and the quiet pressure to simply fit in and move on. ${n} kept a journal throughout. One entry read: "The hardest part is not the opposition. It is the silence from people who agree with you but will not say so." When the change finally happened, the impact was significant. But ${n} had learned something more durable than any victory: that the distance between caring and acting is the most important distance any person will ever cross.`;
  return { id:`g5_change_${s}`, grade:'5', title:`${n} Creates Change`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'complicity',meaning:'involvement in or sharing responsibility for a wrongdoing',example:'Acknowledgement without action is its own form of complicity.'},
      {word:'bureaucracy',meaning:'a system of complex official rules and processes',example:`${n} faced bureaucracy at every step.`},
      {word:'durable',meaning:'lasting for a long time; not easily changed',example:`${n} learned something more durable than any victory.`},
      {word:'methodically',meaning:'in a careful, organised, and systematic way',example:`${n} worked methodically for eighteen months.`},
    ],
    questions:[
      {type:'mcq',question:`What injustice did ${n} want to address?`,options:['A bad test result','A broken school gate',`The fact that ${in_.split(' ').slice(0,6).join(' ')}...`,'A noisy classroom'],answer:`The fact that ${in_.split(' ').slice(0,6).join(' ')}...`,explanation:`${n} was troubled by the fact that ${in_}.`},
      {type:'mcq',question:`What did ${n} say was the hardest part of creating change?`,options:['Doing the research','Getting funding','The silence from people who agree but won\'t act','Talking to officials'],answer:"The silence from people who agree but won't act",explanation:`${n}'s journal said "The hardest part is not the opposition. It is the silence from people who agree with you but will not say so."`},
      {type:'mcq',question:`What did ${n} learn that was more important than the victory?`,options:['How to write reports','How to be popular','The distance between caring and acting is the most important distance to cross','How to avoid bureaucracy'],answer:'The distance between caring and acting is the most important distance to cross',explanation:`${n} learned "the distance between caring and acting is the most important distance any person will ever cross."`},
      {type:'true_false',question:`${n} gave up when faced with resistance.`,options:['True','False'],answer:'False',explanation:`${n} faced "bureaucracy, indifference, and quiet pressure" but continued for eighteen months.`},
      {type:'true_false',question:`${n} kept a journal throughout the campaign.`,options:['True','False'],answer:'True',explanation:`"${n} kept a journal throughout" — with entries about the experience.`},
      {type:'fill_blank',question:`${n} decided that acknowledgement without action was its own form of ___.`,answer:'complicity',explanation:`"Acknowledgement without action was its own form of complicity."`},
    ]
  };
}

function genG5_discovery(s) {
  const n  = pick(NAMES_45, s*3);
  const di = pick(['a way to make drinking water safe using only sunlight and a simple filter','a method to predict local crop disease two weeks before it appeared','a mapping process that revealed a lost Indigenous settlement beneath a modern road','a pattern in migratory bird data that indicated an unreported shift in climate zones','a correlation between urban light pollution and declining insect biodiversity','a way to restore degraded coral using sound frequencies from healthy reefs'], s+1);
  const im = pick(['clean water reached three remote villages within a year','farmers reduced crop loss by forty percent in the pilot region','the road was rerouted and a cultural heritage site was preserved','the data was cited in two international climate reports','a city-wide lighting ordinance was introduced, increasing insect numbers measurably','it was trialled successfully in five reef systems across two oceans'], s+2);
  const c  = `${n} did not set out to change the world. ${n} was simply trying to answer a question that would not leave alone: what if there were a better way? Over two years of quiet, persistent work — mostly evenings and weekends — ${n} discovered ${di}. The discovery was shared first with a mentor, then with a research institution, then with the wider scientific community. Not everyone believed it immediately. Scientific progress rarely receives applause at the front door. It is let in, slowly, through the side. But the evidence was solid. Within three years, ${im}. At a youth innovation summit, ${n} was asked what motivated the work. The answer was simple: "I was not trying to be important. I was trying to be useful." The audience was silent for a moment, then stood up.`;
  return { id:`g5_disc_${s}`, grade:'5', title:`${n}'s Discovery`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'persistent',meaning:'continuing firmly despite difficulty',example:`${n}'s persistent work led to the discovery.`},
      {word:'institution',meaning:'an established organisation or place of research or education',example:'The discovery was shared with a research institution.'},
      {word:'biodiversity',meaning:'the variety of living species in an area',example:'Declining insect biodiversity is a serious issue.'},
      {word:'motivated',meaning:'given a reason and desire to do something',example:`${n} was asked what motivated the work.`},
    ],
    questions:[
      {type:'mcq',question:`What did ${n} discover?`,options:['A new type of weather','A historical date',`${cap(di.split(' ').slice(0,6).join(' '))}...`,'A faster maths method'],answer:`${cap(di.split(' ').slice(0,6).join(' '))}...`,explanation:`${n} discovered ${di}.`},
      {type:'mcq',question:`What was the impact of the discovery?`,options:['It was ignored','It was stolen','It changed nothing',`${cap(im)}`],answer:`${cap(im)}`,explanation:`The impact was that ${im}.`},
      {type:'mcq',question:`What did ${n} say motivated the work?`,options:['"I wanted to be famous"','"I was trying to be useful"','"I needed the money"','"My teacher told me to"'],answer:'"I was trying to be useful"',explanation:`${n} said "I was not trying to be important. I was trying to be useful."`},
      {type:'true_false',question:`The scientific community immediately accepted ${n}'s discovery with enthusiasm.`,options:['True','False'],answer:'False',explanation:`"Not everyone believed it immediately. Scientific progress is let in slowly."`},
      {type:'true_false',question:`${n} worked mostly on evenings and weekends for two years.`,options:['True','False'],answer:'True',explanation:`"Two years of quiet, persistent work — mostly evenings and weekends."`},
      {type:'fill_blank',question:`${n} said "I was not trying to be important. I was trying to be ___."`  ,answer:'useful',explanation:`${n} said "I was trying to be useful."`},
    ]
  };
}

function genG5_culture(s) {
  const n1 = pick(NAMES_45, s);
  const n2 = pick(NAMES_45, s+5);
  const ba = pick(['language — they could not speak each other\'s fluently','food traditions that seemed strange to the other','a completely different approach to school and achievement','family structures that neither fully understood','a deep cultural difference in how disagreement was expressed','different attitudes toward silence and personal space'], s+2);
  const br = pick(['translating not just words but meanings for each other','sharing meals and explaining the stories behind each dish','learning to study together by combining their different approaches','visiting each other\'s homes and meeting each other\'s families','practising disagreement together and learning each other\'s styles','spending time in comfortable silence, without needing to fill it'], s+3);
  const c  = `When ${n1} and ${n2} were paired together for a year-long project, neither was pleased. Between them stood ${ba}. At first, every interaction felt careful and awkward, like walking on uncertain ground. Both had privately assumed the other would be difficult. Then a small incident — a misunderstanding about instructions that turned into an accidental hour of laughter — cracked something open. They began ${br}. It was slow and sometimes uncomfortable. Neither understood everything. But both kept trying. By the end of the year, they had produced work that neither could have made alone — not just because of skill, but because of perspective. At the final presentation, ${n1} said: "The most interesting things I learned this year, I did not learn from a book." ${n2} smiled and added: "Some education only happens when you are genuinely willing to be changed by someone different from you."`;
  return { id:`g5_cult_${s}`, grade:'5', title:`${n1} and ${n2}: Across the Distance`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'awkward',meaning:'uncomfortable and uncertain, especially in social situations',example:'Every interaction felt careful and awkward at first.'},
      {word:'perspective',meaning:'a particular point of view, shaped by who you are and what you have experienced',example:'Their work was stronger because of each other\'s perspective.'},
      {word:'genuinely',meaning:'in a real, sincere, and honest way',example:'Education happens when you are genuinely willing to be changed.'},
      {word:'interaction',meaning:'a moment or process of communicating and engaging with someone',example:'At first, every interaction felt awkward.'},
    ],
    questions:[
      {type:'mcq',question:`What stood between ${n1} and ${n2} at the start?`,options:['A science disagreement','A competition','Their age difference',`${cap(ba.split(' ').slice(0,5).join(' '))}...`],answer:`${cap(ba.split(' ').slice(0,5).join(' '))}...`,explanation:`The barrier between them was ${ba}.`},
      {type:'mcq',question:`What event cracked open the awkwardness between them?`,options:['A shared test','A sports victory','An accidental hour of laughter from a misunderstanding','A teacher\'s praise'],answer:'An accidental hour of laughter from a misunderstanding',explanation:`"A misunderstanding about instructions that turned into an accidental hour of laughter — cracked something open."`},
      {type:'mcq',question:`What did ${n2} say about education at the final presentation?`,options:['"Books are the best teachers"','"Some education only happens when you are genuinely willing to be changed by someone different"','"Working together is too hard"','"Grades matter most"'],answer:'"Some education only happens when you are genuinely willing to be changed by someone different"',explanation:`${n2} said "Some education only happens when you are genuinely willing to be changed by someone different from you."`},
      {type:'true_false',question:`${n1} and ${n2} were excited to work together from the beginning.`,options:['True','False'],answer:'False',explanation:`"Neither was pleased" when they were first paired together.`},
      {type:'true_false',question:`Their work was stronger because they had different perspectives.`,options:['True','False'],answer:'True',explanation:`They produced work "not just because of skill, but because of perspective."`},
      {type:'fill_blank',question:`${n1} said: "The most interesting things I learned this year, I did not learn from a ___."`  ,answer:'book',explanation:`${n1} said "I did not learn from a book."`},
    ]
  };
}

function genG5_legacy(s) {
  const n  = pick(NAMES_45, s*4);
  const ch = pick(['rebuilding a community orchard that had been lost to development','restoring a school archive of ninety years that had been stored in a leaking basement','creating a mentorship programme between older and younger students that the school adopted permanently','documenting and preserving local craft techniques from three elderly artisans before they could be lost','starting a public reading initiative that reached a thousand children in eighteen months','establishing an intergenerational storytelling project that connected nursing homes and primary schools'], s+1);
  const le = pick(['that the most meaningful work is rarely noticed while you are doing it','that legacy is not about being remembered — it is about leaving something that continues without you','that a single sustained act of generosity can outlast any individual achievement','that the quality of what you build matters far less than whether it can stand on its own without you','that leaving something better than you found it is enough','that the most powerful thing you can give a community is something it can own and continue itself'], s+2);
  const c  = `By the age of thirteen, ${n} had already finished one extraordinary project: ${ch}. It had not started as a grand ambition. It had started as a small act of noticing — seeing something precious about to disappear and refusing to be comfortable with that. The work took three years and no fewer than forty setbacks. There were moments when it seemed pointless. There were moments when the only person who believed in it was ${n} and one steadfast supporter. But ${n} kept going. When the project was finally complete and handed over to the community, ${n} was asked how it felt. The answer was unexpected: "Mostly I feel ready to begin the next one." A journalist wrote about the project for a national magazine. They ended the piece with a question: "What do you hope your legacy will be?" ${n} paused, then replied: "${le}." The journalist printed it without changing a word.`;
  return { id:`g5_legacy_${s}`, grade:'5', title:`${n}'s Lasting Work`, content:c, difficulty:'hard', wordCount:c.split(' ').length,
    vocabulary:[
      {word:'legacy',meaning:'something left behind that continues to have value and impact',example:`${n} was asked about legacy.`},
      {word:'steadfast',meaning:'firmly committed; not changing or giving up',example:`${n} had one steadfast supporter.`},
      {word:'setbacks',meaning:'events that slow down or temporarily reverse progress',example:'There were no fewer than forty setbacks.'},
      {word:'extraordinary',meaning:'far beyond what is usual or ordinary; remarkable',example:`${n} had finished one extraordinary project.`},
    ],
    questions:[
      {type:'mcq',question:`What project had ${n} completed?`,options:['Writing a novel',`${cap(ch.split(' ').slice(0,6).join(' '))}...`,'Building a robot','Running a marathon'],answer:`${cap(ch.split(' ').slice(0,6).join(' '))}...`,explanation:`${n} had been ${ch}.`},
      {type:'mcq',question:`What did ${n} say when asked how it felt to finish?`,options:['"I am exhausted"','"I am proud"','"Mostly I feel ready to begin the next one"','"I want recognition"'],answer:'"Mostly I feel ready to begin the next one"',explanation:`${n} said "Mostly I feel ready to begin the next one" — already thinking ahead.`},
      {type:'mcq',question:`What did ${n} say about legacy?`,options:['"Legacy is about being famous"','Legacy is about money',`"${le}"`,'Legacy does not matter'],answer:`"${le}"`,explanation:`${n}'s reply about legacy was: "${le}"`},
      {type:'true_false',question:`${n} started the project with a grand ambitious plan.`,options:['True','False'],answer:'False',explanation:`"It had not started as a grand ambition. It had started as a small act of noticing."`},
      {type:'true_false',question:`${n} faced many setbacks during the project.`,options:['True','False'],answer:'True',explanation:`"The work took three years and no fewer than forty setbacks."`},
      {type:'fill_blank',question:`${n} refused to be ___ with something precious about to disappear.`,answer:'comfortable',explanation:`${n} was "refusing to be comfortable with that" — it motivated the entire project.`},
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORY ENGINE — Collection & Export Functions
// ═══════════════════════════════════════════════════════════════════════════════

// Map of grade → array of generator functions
const GENERATORS = {
  K:  [genK_pet, genK_rainy, genK_school, genK_nature, genK_family],
  1:  [genG1_skill, genG1_garden, genG1_friend, genG1_lost, genG1_weather],
  2:  [genG2_science, genG2_rescue, genG2_team, genG2_bake, genG2_market],
  3:  [genG3_brave, genG3_mystery, genG3_community, genG3_invention, genG3_nature],
  4:  [genG4_science, genG4_history, genG4_environment, genG4_problem, genG4_adventure],
  5:  [genG5_choice, genG5_change, genG5_discovery, genG5_culture, genG5_legacy],
};

// Grade metadata
const GRADE_META = {
  K:  { label: 'Kindergarten', difficulty: 'easy',   sentenceHint: '3–5 sentences', color: '#E91E63' },
  1:  { label: 'Grade 1',      difficulty: 'easy',   sentenceHint: '4–6 sentences', color: '#FF5722' },
  2:  { label: 'Grade 2',      difficulty: 'medium', sentenceHint: '6–8 sentences', color: '#FF9800' },
  3:  { label: 'Grade 3',      difficulty: 'medium', sentenceHint: '7–9 sentences', color: '#8BC34A' },
  4:  { label: 'Grade 4',      difficulty: 'hard',   sentenceHint: '9–11 sentences', color: '#00BCD4' },
  5:  { label: 'Grade 5',      difficulty: 'hard',   sentenceHint: '10–12 sentences', color: '#9C27B0' },
};

/**
 * Returns 25 unique stories for a given grade.
 * 5 generator functions × 5 seed values = 25 stories.
 * @param {string|number} grade - e.g. 'K', '1', '2', ..., '5'
 */
export function getStoriesForGrade(grade) {
  const key = String(grade);
  const gens = GENERATORS[key] || GENERATORS['3'];
  const stories = [];
  for (let seed = 0; seed < 5; seed++) {
    gens.forEach((gen) => {
      try {
        stories.push(gen(seed));
      } catch (e) {
        // Fallback: skip failed generation silently
      }
    });
  }
  return stories; // 25 stories per grade
}

/**
 * Returns a story by its id from a given grade's story pool.
 */
export function getStoryById(id, grade) {
  const stories = getStoriesForGrade(grade || 'K');
  return stories.find((s) => s.id === id) || stories[0];
}

/**
 * Returns a random story for a given grade.
 */
export function getRandomStory(grade) {
  const stories = getStoriesForGrade(grade);
  return stories[Math.floor(Math.random() * stories.length)];
}

/**
 * Returns grade metadata (label, color, difficulty hint).
 */
export function getGradeMeta(grade) {
  return GRADE_META[String(grade)] || GRADE_META['3'];
}

export default { getStoriesForGrade, getStoryById, getRandomStory, getGradeMeta };
