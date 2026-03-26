/**
 * SmartKids — Math Animation Scenes
 * Interactive animated visualizations using React Native built-in Animated API.
 * NO react-native-reanimated (stubbed). Uses only RN Animated + emoji objects.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Easing,
} from 'react-native';

// ─── Animated Emoji Atom ───────────────────────────────────────────────────────
const AnimEmoji = ({ emoji, style, delay = 0, animate = true }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]).start();
  }, [animate, delay]);

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </Animated.View>
  );
};

// ─── COUNTING SCENE ─────────────────────────────────────────────────────────
export const CountingScene = ({ slide, onInteract }) => {
  const { objects = ['⭐','⭐','⭐'], countUpTo = 3 } = slide;
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleTap = () => {
    if (current < countUpTo) {
      const next = current + 1;
      setCurrent(next);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 120, useNativeDriver: true }),
        Animated.spring(pulseAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
      if (next === countUpTo) {
        setDone(true);
        if (onInteract) onInteract(true);
      }
    }
  };

  const handleReset = () => { setCurrent(0); setDone(false); };

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>Tap the objects to count them! 👆</Text>
      <View style={styles.emojiGrid}>
        {objects.slice(0, countUpTo).map((em, i) => (
          <TouchableOpacity
            key={i}
            onPress={handleTap}
            activeOpacity={0.7}
            style={[
              styles.emojiTapArea,
              i < current && styles.emojiTapped,
            ]}
          >
            <Text style={[styles.emojiText, i >= current && styles.emojiDimmed]}>{em}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View style={[styles.countDisplay, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.countNumber}>{current}</Text>
        <Text style={styles.countLabel}>/ {countUpTo}</Text>
      </Animated.View>
      {done && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>🎉 You counted {countUpTo}!</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── COUNTING INTRO SCENE ─────────────────────────────────────────────────────
export const CountingIntroScene = ({ slide }) => {
  const { objects = ['⭐','⭐','⭐'], highlightNumber = 3 } = slide;
  return (
    <View style={styles.sceneContainer}>
      <View style={styles.emojiRow}>
        {objects.map((em, i) => (
          <AnimEmoji key={i} emoji={em} delay={i * 200} animate />
        ))}
      </View>
      <View style={styles.countDisplay}>
        <Text style={styles.countNumber}>{highlightNumber}</Text>
        <Text style={styles.countLabel}>objects</Text>
      </View>
    </View>
  );
};

// ─── ADDITION SCENE ──────────────────────────────────────────────────────────
export const AdditionScene = ({ slide, onInteract }) => {
  const {
    leftEmoji = '🍎', leftCount = 2,
    rightEmoji = '🍎', rightCount = 3,
    result = 5,
  } = slide;

  const [phase, setPhase] = useState(0); // 0=show groups, 1=merging, 2=result
  const mergeAnim = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;

  const handleMerge = () => {
    if (phase === 0) {
      setPhase(1);
      Animated.timing(mergeAnim, {
        toValue: 1, duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setPhase(2);
        Animated.spring(resultScale, {
          toValue: 1, friction: 5, tension: 80, useNativeDriver: true,
        }).start(() => { if (onInteract) onInteract(true); });
      });
    } else {
      setPhase(0);
      mergeAnim.setValue(0);
      resultScale.setValue(0);
    }
  };

  const translateRight = mergeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });

  return (
    <View style={styles.sceneContainer}>
      <View style={styles.additionRow}>
        {/* Left group */}
        <View style={styles.emojiGroup}>
          {Array.from({ length: leftCount }).map((_, i) => (
            <AnimEmoji key={i} emoji={leftEmoji} delay={i * 100} animate />
          ))}
          <Text style={styles.groupLabel}>{leftCount}</Text>
        </View>

        {/* Plus sign */}
        <View style={styles.operatorBox}>
          <Text style={styles.operatorText}>+</Text>
        </View>

        {/* Right group */}
        <Animated.View style={[styles.emojiGroup, { transform: [{ translateX: translateRight }] }]}>
          {Array.from({ length: rightCount }).map((_, i) => (
            <AnimEmoji key={i} emoji={rightEmoji} delay={i * 100} animate />
          ))}
          <Text style={styles.groupLabel}>{rightCount}</Text>
        </Animated.View>
      </View>

      {/* Result */}
      {phase === 2 && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: resultScale }] }]}>
          <Text style={styles.resultLabel}>= {result}</Text>
          <View style={styles.resultEmojiRow}>
            {Array.from({ length: result }).map((_, i) => (
              <Text key={i} style={styles.smallEmoji}>{leftEmoji}</Text>
            ))}
          </View>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.actionBtn} onPress={handleMerge} activeOpacity={0.8}>
        <Text style={styles.actionBtnText}>
          {phase === 0 ? '➕ Combine!' : phase === 1 ? '⏳ Merging...' : '🔄 Try Again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── ADDITION INTRO SCENE ────────────────────────────────────────────────────
export const AdditionIntroScene = ({ slide }) => (
  <View style={styles.sceneContainer}>
    <View style={styles.additionRow}>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>2</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>+</Text>
      </View>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>3</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>=</Text>
      </View>
      <View style={[styles.introSymbolBox, { backgroundColor: '#C8E6C9' }]}>
        <Text style={[styles.introSymbol, { color: '#1B5E20' }]}>5</Text>
      </View>
    </View>
    <Text style={styles.sceneInstruction}>➕ means put together!</Text>
  </View>
);

// ─── SUBTRACTION SCENE ───────────────────────────────────────────────────────
export const SubtractionScene = ({ slide, onInteract }) => {
  const {
    startEmoji = '🎈', startCount = 5, removeCount = 2, result = 3,
  } = slide;

  const [removed, setRemoved] = useState(0);
  const [done, setDone] = useState(false);
  const shakeAnims = useRef(
    Array.from({ length: startCount }).map(() => new Animated.Value(0))
  ).current;
  const opacities = useRef(
    Array.from({ length: startCount }).map(() => new Animated.Value(1))
  ).current;

  const handleRemove = () => {
    if (removed < removeCount) {
      const idx = removed;
      Animated.sequence([
        Animated.timing(shakeAnims[idx], { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnims[idx], { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnims[idx], { toValue: 0, duration: 60, useNativeDriver: true }),
        Animated.timing(opacities[idx], { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        const next = removed + 1;
        setRemoved(next);
        if (next >= removeCount) {
          setDone(true);
          if (onInteract) onInteract(true);
        }
      });
    }
  };

  const handleReset = () => {
    shakeAnims.forEach((a) => a.setValue(0));
    opacities.forEach((a) => a.setValue(1));
    setRemoved(0);
    setDone(false);
  };

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>
        Tap to remove {removeCount} {startEmoji}!
      </Text>
      <View style={styles.emojiGrid}>
        {Array.from({ length: startCount }).map((_, i) => (
          <Animated.View
            key={i}
            style={{
              transform: [{ translateX: shakeAnims[i] }],
              opacity: opacities[i],
            }}
          >
            <TouchableOpacity
              onPress={handleRemove}
              disabled={done || i >= removed && i >= removeCount}
              activeOpacity={0.7}
            >
              <Text style={styles.emojiText}>{startEmoji}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.equationDisplay}>
        <Text style={styles.equationText}>
          {startCount} - {removed} = <Text style={styles.equationResult}>{startCount - removed}</Text>
        </Text>
      </View>

      {done && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>🎉 {startCount} - {removeCount} = {result}!</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── SUBTRACTION INTRO SCENE ─────────────────────────────────────────────────
export const SubtractionIntroScene = ({ slide }) => (
  <View style={styles.sceneContainer}>
    <View style={styles.additionRow}>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>5</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>-</Text>
      </View>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>2</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>=</Text>
      </View>
      <View style={[styles.introSymbolBox, { backgroundColor: '#FFCDD2' }]}>
        <Text style={[styles.introSymbol, { color: '#B71C1C' }]}>3</Text>
      </View>
    </View>
    <Text style={styles.sceneInstruction}>➖ means take away!</Text>
  </View>
);

// ─── MULTIPLICATION SCENE ────────────────────────────────────────────────────
export const MultiplicationScene = ({ slide, onInteract }) => {
  const { groups = 2, perGroup = 3, emoji = '🍪', result = 6 } = slide;
  const [revealed, setRevealed] = useState(0);
  const groupScales = useRef(
    Array.from({ length: groups }).map(() => new Animated.Value(0))
  ).current;

  const revealNext = () => {
    if (revealed < groups) {
      const idx = revealed;
      Animated.spring(groupScales[idx], {
        toValue: 1, friction: 5, tension: 80, useNativeDriver: true,
      }).start(() => {
        const next = revealed + 1;
        setRevealed(next);
        if (next >= groups && onInteract) onInteract(true);
      });
    }
  };

  const handleReset = () => {
    groupScales.forEach((a) => a.setValue(0));
    setRevealed(0);
  };

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>
        Tap to reveal each group of {perGroup}!
      </Text>
      <View style={styles.groupsContainer}>
        {Array.from({ length: groups }).map((_, g) => (
          <Animated.View
            key={g}
            style={[styles.groupBox, { transform: [{ scale: groupScales[g] }] }]}
          >
            <View style={styles.groupInner}>
              {Array.from({ length: perGroup }).map((_, i) => (
                <Text key={i} style={styles.smallEmoji}>{emoji}</Text>
              ))}
            </View>
            <Text style={styles.groupCount}>{perGroup}</Text>
          </Animated.View>
        ))}
      </View>

      {revealed > 0 && (
        <View style={styles.equationDisplay}>
          <Text style={styles.equationText}>
            {revealed} × {perGroup} ={' '}
            <Text style={styles.equationResult}>{revealed * perGroup}</Text>
            {revealed < groups ? ` (so far)` : ` = ${result} ✅`}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={revealed < groups ? revealNext : handleReset}
        activeOpacity={0.8}
      >
        <Text style={styles.actionBtnText}>
          {revealed < groups ? `Show Group ${revealed + 1} 👉` : '🔄 Reset'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── MULTIPLICATION INTRO SCENE ───────────────────────────────────────────────
export const MultiplicationIntroScene = ({ slide }) => (
  <View style={styles.sceneContainer}>
    <Text style={styles.sceneInstruction}>Multiplication = groups of things!</Text>
    <View style={styles.groupsContainer}>
      {[0,1].map((g) => (
        <View key={g} style={styles.groupBox}>
          <View style={styles.groupInner}>
            {['🍪','🍪','🍪'].map((em, i) => (
              <Text key={i} style={styles.smallEmoji}>{em}</Text>
            ))}
          </View>
          <Text style={styles.groupCount}>3</Text>
        </View>
      ))}
    </View>
    <Text style={styles.equationText}>2 × 3 = 6</Text>
  </View>
);

// ─── DIVISION SCENE ──────────────────────────────────────────────────────────
export const DivisionScene = ({ slide, onInteract }) => {
  const { total = 6, groups = 2, emoji = '🍪', result = 3 } = slide;
  const [distributed, setDistributed] = useState(Array.from({ length: groups }, () => 0));
  const [itemsLeft, setItemsLeft] = useState(total);
  const [done, setDone] = useState(false);
  const itemAnims = useRef(
    Array.from({ length: total }).map(() => new Animated.Value(1))
  ).current;

  const distributeOne = () => {
    if (itemsLeft <= 0) return;
    const current = total - itemsLeft;
    const targetGroup = current % groups;
    Animated.timing(itemAnims[current], {
      toValue: 0.5, duration: 300, useNativeDriver: true,
    }).start(() => {
      const newDist = [...distributed];
      newDist[targetGroup] += 1;
      setDistributed(newDist);
      setItemsLeft(itemsLeft - 1);
      if (itemsLeft - 1 === 0) {
        setDone(true);
        if (onInteract) onInteract(true);
      }
    });
  };

  const handleReset = () => {
    itemAnims.forEach((a) => a.setValue(1));
    setDistributed(Array.from({ length: groups }, () => 0));
    setItemsLeft(total);
    setDone(false);
  };

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>
        Share {total} {emoji} equally into {groups} groups!
      </Text>

      {/* Items to distribute */}
      <View style={styles.emojiGrid}>
        {Array.from({ length: total }).map((_, i) => (
          <Animated.View key={i} style={{ opacity: itemAnims[i] }}>
            <Text style={[styles.emojiText, i >= (total - itemsLeft) && styles.emojiDimmed]}>
              {emoji}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Target groups */}
      <View style={styles.groupsContainer}>
        {distributed.map((count, g) => (
          <View key={g} style={styles.groupBox}>
            <Text style={styles.groupLabel}>Group {g + 1}</Text>
            <View style={styles.groupInner}>
              {Array.from({ length: count }).map((_, i) => (
                <Text key={i} style={styles.smallEmoji}>{emoji}</Text>
              ))}
            </View>
            <Text style={styles.groupCount}>{count}</Text>
          </View>
        ))}
      </View>

      {done ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            🎉 {total} ÷ {groups} = {result}!
          </Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.actionBtn} onPress={distributeOne} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>Share one {emoji} ➡️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── DIVISION INTRO SCENE ─────────────────────────────────────────────────────
export const DivisionIntroScene = ({ slide }) => (
  <View style={styles.sceneContainer}>
    <Text style={styles.sceneInstruction}>Division = sharing equally!</Text>
    <View style={styles.additionRow}>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>6</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>÷</Text>
      </View>
      <View style={styles.introSymbolBox}>
        <Text style={styles.introSymbol}>2</Text>
      </View>
      <View style={styles.operatorBox}>
        <Text style={styles.operatorText}>=</Text>
      </View>
      <View style={[styles.introSymbolBox, { backgroundColor: '#E3F2FD' }]}>
        <Text style={[styles.introSymbol, { color: '#0D47A1' }]}>3</Text>
      </View>
    </View>
  </View>
);

// ─── FRACTION SCENE ──────────────────────────────────────────────────────────
export const FractionScene = ({ slide, onInteract }) => {
  const { numerator = 1, denominator = 2 } = slide;
  const [shaded, setShaded] = useState(0);
  const [done, setDone] = useState(false);

  const handleTap = (idx) => {
    if (done) return;
    const next = idx + 1;
    setShaded(next);
    if (next === numerator) {
      setDone(true);
      if (onInteract) onInteract(true);
    }
  };

  const handleReset = () => { setShaded(0); setDone(false); };

  const fractionStr = `${numerator}/${denominator}`;

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.fractionDisplay}>{fractionStr}</Text>
      <Text style={styles.sceneInstruction}>
        Tap {numerator} of {denominator} pieces to shade them!
      </Text>
      <View style={styles.fractionBar}>
        {Array.from({ length: denominator }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.fractionPiece,
              { borderRightWidth: i < denominator - 1 ? 2 : 0 },
              i < shaded && styles.fractionPieceShaded,
            ]}
            onPress={() => handleTap(i)}
            disabled={done || i >= shaded + 1}
            activeOpacity={0.7}
          />
        ))}
      </View>
      {done && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>🎉 You shaded {fractionStr}!</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── FRACTION INTRO SCENE ────────────────────────────────────────────────────
export const FractionIntroScene = ({ slide }) => {
  const { numerator = 1, denominator = 2 } = slide;
  return (
    <View style={styles.sceneContainer}>
      <View style={styles.bigFractionDisplay}>
        <Text style={styles.bigFractionNum}>{numerator}</Text>
        <View style={styles.fractionLine} />
        <Text style={styles.bigFractionDen}>{denominator}</Text>
      </View>
      <View style={styles.fractionBar}>
        {Array.from({ length: denominator }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.fractionPiece,
              { borderRightWidth: i < denominator - 1 ? 2 : 0 },
              i < numerator && styles.fractionPieceShaded,
            ]}
          />
        ))}
      </View>
      <Text style={styles.sceneInstruction}>
        {numerator} of {denominator} equal parts
      </Text>
    </View>
  );
};

// ─── FRACTION PIZZA SCENE ────────────────────────────────────────────────────
export const FractionPizzaScene = ({ slide }) => {
  const { numerator = 1, denominator = 2 } = slide;
  const segments = Array.from({ length: denominator });
  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>
        🍕 {numerator}/{denominator} of a pizza
      </Text>
      <View style={styles.fractionBar}>
        {segments.map((_, i) => (
          <View
            key={i}
            style={[
              styles.fractionPiece,
              { borderRightWidth: i < denominator - 1 ? 2 : 0 },
              i < numerator && styles.fractionPieceShaded,
            ]}
          />
        ))}
      </View>
      <View style={styles.bigFractionDisplay}>
        <Text style={styles.bigFractionNum}>{numerator}</Text>
        <View style={styles.fractionLine} />
        <Text style={styles.bigFractionDen}>{denominator}</Text>
      </View>
    </View>
  );
};

// ─── FRACTION COMPARE SCENE ───────────────────────────────────────────────────
export const FractionCompareScene = ({ slide }) => {
  const { fractionA = { n: 1, d: 2 }, fractionB = { n: 1, d: 4 } } = slide;
  return (
    <View style={styles.sceneContainer}>
      <View style={styles.compareRow}>
        {/* Fraction A */}
        <View style={styles.compareSide}>
          <Text style={styles.compareLabel}>{fractionA.n}/{fractionA.d}</Text>
          <View style={styles.fractionBar}>
            {Array.from({ length: fractionA.d }).map((_, i) => (
              <View key={i} style={[
                styles.fractionPiece,
                { borderRightWidth: i < fractionA.d - 1 ? 2 : 0 },
                i < fractionA.n && styles.fractionPieceShaded,
              ]} />
            ))}
          </View>
        </View>

        {/* vs */}
        <Text style={styles.vsText}>vs</Text>

        {/* Fraction B */}
        <View style={styles.compareSide}>
          <Text style={styles.compareLabel}>{fractionB.n}/{fractionB.d}</Text>
          <View style={styles.fractionBar}>
            {Array.from({ length: fractionB.d }).map((_, i) => (
              <View key={i} style={[
                styles.fractionPiece,
                { borderRightWidth: i < fractionB.d - 1 ? 2 : 0 },
                i < fractionB.n && styles.fractionPieceShaded,
              ]} />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.sceneInstruction}>
        Which fraction is bigger?{' '}
        {fractionA.n / fractionA.d > fractionB.n / fractionB.d
          ? `${fractionA.n}/${fractionA.d} is bigger!`
          : `${fractionB.n}/${fractionB.d} is bigger!`}
      </Text>
    </View>
  );
};

// ─── TIMES TABLE SCENE ────────────────────────────────────────────────────────
export const TimesTableScene = ({ slide }) => {
  const { base = 5, upTo = 5 } = slide;
  const rows = Array.from({ length: upTo }, (_, i) => i + 1);
  const anims = useRef(rows.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    rows.forEach((_, i) => {
      Animated.sequence([
        Animated.delay(i * 250),
        Animated.spring(anims[i], { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>{base} times table</Text>
      {rows.map((n, i) => (
        <Animated.View
          key={n}
          style={[styles.tableRow, { opacity: anims[i], transform: [{ translateX: anims[i].interpolate({ inputRange: [0,1], outputRange: [-40,0] }) }] }]}
        >
          <Text style={styles.tableText}>
            {base} × {n} = <Text style={styles.tableResult}>{base * n}</Text>
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

// ─── NUMBER LINE SCENE ────────────────────────────────────────────────────────
export const NumberLineScene = ({ slide }) => {
  const { start = 3, jump = 4, result = 7 } = slide;
  const markerAnim = useRef(new Animated.Value(0)).current;
  const [started, setStarted] = useState(false);

  const handleAnimate = () => {
    if (started) { markerAnim.setValue(0); setStarted(false); return; }
    setStarted(true);
    Animated.timing(markerAnim, {
      toValue: 1, duration: 1200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const maxNum = result + 1;
  const markerPos = markerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${(start / maxNum) * 90}%`, `${(result / maxNum) * 90}%`],
  });

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>
        Start at {start}, jump {jump} → land on {result}!
      </Text>
      <View style={styles.numberLineContainer}>
        <View style={styles.numberLine} />
        {Array.from({ length: maxNum + 1 }, (_, i) => (
          <View key={i} style={[styles.numberTick, { left: `${(i / maxNum) * 90}%` }]}>
            <View style={styles.tick} />
            <Text style={styles.tickLabel}>{i}</Text>
          </View>
        ))}
        <Animated.View style={[styles.numberMarker, { left: markerPos }]}>
          <Text style={styles.markerText}>🐸</Text>
        </Animated.View>
      </View>
      <TouchableOpacity style={styles.actionBtn} onPress={handleAnimate}>
        <Text style={styles.actionBtnText}>
          {started ? '🔄 Reset' : '▶️ Jump!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── WORD PROBLEM SCENE ───────────────────────────────────────────────────────
export const WordProblemScene = ({ slide }) => {
  const { story, keyword, operation, numA, numB, result, emoji = '🌟' } = slide;
  const [showAnswer, setShowAnswer] = useState(false);
  const answerScale = useRef(new Animated.Value(0)).current;

  const handleReveal = () => {
    setShowAnswer(true);
    Animated.spring(answerScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.sceneContainer}>
      <View style={styles.storyBox}>
        <Text style={styles.storyText}>{story}</Text>
      </View>
      <View style={styles.keywordBox}>
        <Text style={styles.keywordLabel}>Key word:</Text>
        <Text style={styles.keywordText}>"{keyword}"</Text>
        <Text style={styles.keywordHint}>
          → {operation === 'add' ? '➕ ADD' : operation === 'sub' ? '➖ SUBTRACT' : operation === 'mul' ? '✖️ MULTIPLY' : '➗ DIVIDE'}
        </Text>
      </View>

      <View style={styles.additionRow}>
        <Text style={styles.problemEmoji}>{emoji}</Text>
        <Text style={styles.equationText}>
          {numA} {operation === 'add' ? '+' : operation === 'sub' ? '-' : operation === 'mul' ? '×' : '÷'} {numB}
        </Text>
      </View>

      {showAnswer ? (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: answerScale }] }]}>
          <Text style={styles.resultLabel}>= {result} {emoji}</Text>
        </Animated.View>
      ) : (
        <TouchableOpacity style={styles.actionBtn} onPress={handleReveal}>
          <Text style={styles.actionBtnText}>🔍 Show Answer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── WORD PROBLEM INTRO SCENE ─────────────────────────────────────────────────
export const WordProblemIntroScene = ({ slide }) => {
  const { keywords = {} } = slide;
  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>Look for KEY WORDS!</Text>
      <View style={styles.keywordGrid}>
        {Object.entries(keywords).map(([op, words]) => (
          <View key={op} style={styles.keywordCategory}>
            <Text style={styles.keywordCatLabel}>
              {op === 'add' ? '➕ Add' : op === 'sub' ? '➖ Subtract' : op === 'mul' ? '✖️ Multiply' : '➗ Divide'}
            </Text>
            {(words || []).map((w, i) => (
              <View key={i} style={styles.keywordPill}>
                <Text style={styles.keywordPillText}>{w}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── PLACE VALUE SCENE ────────────────────────────────────────────────────────
export const PlaceValueScene = ({ slide }) => {
  const { tensCount = 2, onesCount = 3, number = 23 } = slide;
  const blockAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(blockAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.bigNumber}>{number}</Text>
      <View style={styles.placeValueRow}>
        <View style={styles.placeColumn}>
          <Text style={styles.placeLabel}>Tens</Text>
          {Array.from({ length: tensCount }).map((_, i) => (
            <View key={i} style={styles.tensBlock}>
              {Array.from({ length: 10 }).map((_, j) => (
                <View key={j} style={styles.unitBlock} />
              ))}
            </View>
          ))}
          <Text style={styles.placeCount}>{tensCount}</Text>
        </View>
        <View style={styles.placeColumn}>
          <Text style={styles.placeLabel}>Ones</Text>
          <View style={styles.onesRow}>
            {Array.from({ length: onesCount }).map((_, i) => (
              <View key={i} style={styles.onesBlock} />
            ))}
          </View>
          <Text style={styles.placeCount}>{onesCount}</Text>
        </View>
      </View>
    </View>
  );
};

// ─── SHAPE INTRO SCENE ────────────────────────────────────────────────────────
export const ShapeIntroScene = ({ slide }) => {
  const { shape = 'circle', color = '#FF6B6B', sides = 0 } = slide;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const shapeStyle = (() => {
    switch (shape) {
      case 'circle':    return { width: 90, height: 90, borderRadius: 45, backgroundColor: color };
      case 'square':    return { width: 90, height: 90, borderRadius: 6, backgroundColor: color };
      case 'triangle':  return { width: 0, height: 0, borderLeftWidth: 50, borderRightWidth: 50, borderBottomWidth: 90, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color };
      case 'rectangle': return { width: 130, height: 70, borderRadius: 6, backgroundColor: color };
      default:          return { width: 90, height: 90, borderRadius: 45, backgroundColor: color };
    }
  })();

  return (
    <View style={styles.sceneContainer}>
      <Animated.View style={[shapeStyle, { transform: [{ rotate }] }]} />
      <Text style={styles.shapeName}>{shape.charAt(0).toUpperCase() + shape.slice(1)}</Text>
      <Text style={styles.shapeInfo}>
        {sides === 0 ? 'No sides, no corners!' : `${sides} sides, ${sides} corners`}
      </Text>
    </View>
  );
};

// ─── READING SCENES ───────────────────────────────────────────────────────────

// Animated word highlight (letters appear one by one)
export const ReadingHighlightScene = ({ slide }) => {
  const { words = [] } = slide;
  const wordAnims = useRef(words.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    words.forEach((_, i) => {
      Animated.sequence([
        Animated.delay(i * 400),
        Animated.spring(wordAnims[i], { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.sceneContainer}>
      <View style={styles.wordGrid}>
        {words.map((word, i) => (
          <Animated.View
            key={i}
            style={[styles.wordChip, {
              opacity: wordAnims[i],
              transform: [{ scale: wordAnims[i] }],
            }]}
          >
            <Text style={styles.wordChipText}>{word}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// Sentence with highlighted sight words
export const ReadingSentenceScene = ({ slide }) => {
  const { sentence = '', sightWords = [], emoji = '📖' } = slide;
  const words = sentence.split(' ');
  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneSentenceEmoji}>{emoji}</Text>
      <View style={styles.sentenceContainer}>
        {words.map((word, i) => {
          const clean = word.replace(/[.,!?]/g, '');
          const isSight = sightWords.some((sw) => sw.toLowerCase() === clean.toLowerCase());
          return (
            <Text
              key={i}
              style={[styles.sentenceWord, isSight && styles.sightWordHighlight]}
            >
              {word}{' '}
            </Text>
          );
        })}
      </View>
      {slide.tip && (
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>💡 {slide.tip}</Text>
        </View>
      )}
    </View>
  );
};

// Blend animation (letters merge into word)
export const ReadingBlendScene = ({ slide }) => {
  const { letters = [], result = '', emoji = '🔤' } = slide;
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const [blended, setBlended] = useState(false);

  const handleBlend = () => {
    if (blended) {
      letterAnims.forEach((a) => a.setValue(0));
      resultAnim.setValue(0);
      setBlended(false);
      return;
    }
    Animated.stagger(200, letterAnims.map((a) =>
      Animated.spring(a, { toValue: 1, friction: 6, useNativeDriver: true })
    )).start(() => {
      setTimeout(() => {
        setBlended(true);
        Animated.spring(resultAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
      }, 400);
    });
  };

  return (
    <View style={styles.sceneContainer}>
      <View style={styles.blendRow}>
        {letters.map((letter, i) => (
          <Animated.View
            key={i}
            style={[styles.letterBlock, { opacity: letterAnims[i], transform: [{ scale: letterAnims[i] }] }]}
          >
            <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
          </Animated.View>
        ))}
      </View>
      {blended && (
        <Animated.View style={[styles.resultWordBox, { transform: [{ scale: resultAnim }] }]}>
          <Text style={styles.resultWord}>{result.toUpperCase()}</Text>
          <Text style={styles.resultEmoji}>{emoji}</Text>
        </Animated.View>
      )}
      <TouchableOpacity style={styles.actionBtn} onPress={handleBlend}>
        <Text style={styles.actionBtnText}>
          {blended ? '🔄 Reset' : '🔤 Blend letters!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Story parts animation
export const ReadingStoryPartsScene = ({ slide }) => {
  const { parts = ['Beginning', 'Middle', 'End'] } = slide;
  const partAnims = useRef(parts.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    parts.forEach((_, i) => {
      Animated.sequence([
        Animated.delay(i * 500),
        Animated.spring(partAnims[i], { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const colors = ['#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  return (
    <View style={styles.sceneContainer}>
      {parts.map((part, i) => (
        <Animated.View
          key={i}
          style={[styles.storyPartBox, {
            backgroundColor: colors[i % colors.length],
            opacity: partAnims[i],
            transform: [{ translateX: partAnims[i].interpolate({ inputRange: [0,1], outputRange: [60,0] }) }],
          }]}
        >
          <Text style={styles.storyPartNumber}>{i + 1}</Text>
          <Text style={styles.storyPartText}>{part}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

// Interactive word reading (tap letters to sound them out)
export const WordReadScene = ({ slide, onInteract }) => {
  const { word = 'CAT', emoji: wordEmoji = '🐱', letters = ['C','A','T'] } = slide;
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const letterScales = useRef(letters.map(() => new Animated.Value(0))).current;
  const wordScale = useRef(new Animated.Value(0)).current;

  const revealNext = () => {
    if (revealed < letters.length) {
      Animated.spring(letterScales[revealed], { toValue: 1, friction: 5, useNativeDriver: true }).start();
      const next = revealed + 1;
      setRevealed(next);
      if (next >= letters.length) {
        setTimeout(() => {
          setDone(true);
          Animated.spring(wordScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
          if (onInteract) onInteract(true);
        }, 400);
      }
    }
  };

  const handleReset = () => {
    letterScales.forEach((a) => a.setValue(0));
    wordScale.setValue(0);
    setRevealed(0);
    setDone(false);
  };

  return (
    <View style={styles.sceneContainer}>
      <View style={styles.blendRow}>
        {letters.map((letter, i) => (
          <Animated.View
            key={i}
            style={[
              styles.letterBlock,
              i < revealed && styles.letterBlockActive,
              { transform: [{ scale: letterScales[i] }], opacity: letterScales[i] },
            ]}
          >
            <Text style={[styles.letterText, i < revealed && styles.letterTextActive]}>
              {letter}
            </Text>
          </Animated.View>
        ))}
      </View>
      {done && (
        <Animated.View style={[styles.resultWordBox, { transform: [{ scale: wordScale }] }]}>
          <Text style={styles.resultWord}>{word}</Text>
          <Text style={styles.resultEmoji}>{wordEmoji}</Text>
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={done ? handleReset : revealNext}
        activeOpacity={0.8}
      >
        <Text style={styles.actionBtnText}>
          {done ? '🔄 Try Again' : revealed < letters.length ? `Tap: "${letters[revealed]}" 🔊` : 'Done!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── MASTER SCENE RESOLVER ────────────────────────────────────────────────────
/**
 * Renders the correct animation scene for a given slide's animationType.
 */
export const AnimationScene = ({ slide, onInteract }) => {
  if (!slide) return null;
  const props = { slide, onInteract };
  switch (slide.animationType) {
    case 'counting_intro':     return <CountingIntroScene {...props} />;
    case 'counting_objects':   return <CountingScene {...props} />;
    case 'addition_intro':     return <AdditionIntroScene {...props} />;
    case 'addition':           return <AdditionScene {...props} />;
    case 'column_add':         return <AdditionScene {...props} />;
    case 'place_value_add':    return <AdditionIntroScene {...props} />;
    case 'subtraction_intro':  return <SubtractionIntroScene {...props} />;
    case 'subtraction':        return <SubtractionScene {...props} />;
    case 'number_line':        return <NumberLineScene {...props} />;
    case 'number_line_sub':    return <NumberLineScene {...props} />;
    case 'column_sub':         return <SubtractionIntroScene {...props} />;
    case 'multiplication_intro': return <MultiplicationIntroScene {...props} />;
    case 'multiplication':     return <MultiplicationScene {...props} />;
    case 'times_table':        return <TimesTableScene {...props} />;
    case 'division_intro':     return <DivisionIntroScene {...props} />;
    case 'division':           return <DivisionScene {...props} />;
    case 'inverse_ops':        return <DivisionIntroScene {...props} />;
    case 'fraction_intro':     return <FractionIntroScene {...props} />;
    case 'fraction_pizza':     return <FractionPizzaScene {...props} />;
    case 'fraction_compare':   return <FractionCompareScene {...props} />;
    case 'place_value':        return <PlaceValueScene {...props} />;
    case 'shape_intro':        return <ShapeIntroScene {...props} />;
    case 'word_problem_intro': return <WordProblemIntroScene {...props} />;
    case 'word_problem':       return <WordProblemScene {...props} />;
    case 'reading_highlight':  return <ReadingHighlightScene {...props} />;
    case 'reading_sentence':   return <ReadingSentenceScene {...props} />;
    case 'reading_blend':      return <ReadingBlendScene {...props} />;
    case 'reading_story_parts': return <ReadingStoryPartsScene {...props} />;
    case 'word_read':          return <WordReadScene {...props} />;
    default:
      // Generic fallback: show title + tip
      return (
        <View style={styles.sceneContainer}>
          <Text style={styles.sceneInstruction}>{slide.tip || 'Watch and learn!'}</Text>
          <View style={styles.emojiRow}>
            {(slide.objects || ['📚','🎓','⭐']).map((em, i) => (
              <AnimEmoji key={i} emoji={em} delay={i * 200} animate />
            ))}
          </View>
        </View>
      );
  }
};

// ─── Interactive Example Scene ────────────────────────────────────────────────
export const InteractiveExample = ({ example, onComplete }) => {
  const { type } = example;

  if (type === 'count_tap') return <CountingScene slide={{ objects: Array(example.count).fill(example.emoji), countUpTo: example.count }} onInteract={onComplete} />;
  if (type === 'drag_add')  return <AdditionScene slide={example} onInteract={onComplete} />;
  if (type === 'subtraction_tap') return <SubtractionScene slide={{ startEmoji: example.startEmoji, startCount: example.startCount, removeCount: example.removeCount, result: example.answer }} onInteract={onComplete} />;
  if (type === 'groups')    return <MultiplicationScene slide={{ groups: example.groups, perGroup: example.perGroup, emoji: example.emoji, result: example.answer }} onInteract={onComplete} />;
  if (type === 'share')     return <DivisionScene slide={{ total: example.total, groups: example.groups, emoji: example.emoji, result: example.answer }} onInteract={onComplete} />;
  if (type === 'fraction_shade') return <FractionScene slide={example} onInteract={onComplete} />;
  if (type === 'word_read') return <WordReadScene slide={example} onInteract={onComplete} />;

  return (
    <View style={styles.sceneContainer}>
      <Text style={styles.sceneInstruction}>{example.question}</Text>
      <Text style={styles.sceneInstruction}>{example.hint}</Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  sceneContainer: { alignItems: 'center', padding: 12, minHeight: 180 },
  sceneInstruction: { fontSize: 15, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 14 },

  // Emoji
  emojiText: { fontSize: 32 },
  emojiDimmed: { opacity: 0.25 },
  emojiTapArea: { padding: 4, borderRadius: 8, margin: 2 },
  emojiTapped: { backgroundColor: '#E8F5E9', borderRadius: 8 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 10 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 12 },
  smallEmoji: { fontSize: 20 },

  // Count display
  countDisplay: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 10 },
  countNumber: { fontSize: 48, fontWeight: '900', color: '#3F51B5' },
  countLabel: { fontSize: 20, color: '#666', marginLeft: 6 },

  // Addition/Subtraction
  additionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginVertical: 10 },
  emojiGroup: { alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10 },
  operatorBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3F51B5', alignItems: 'center', justifyContent: 'center' },
  operatorText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  groupLabel: { fontSize: 18, fontWeight: '800', color: '#3F51B5', marginTop: 4 },
  introSymbolBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' },
  introSymbol: { fontSize: 26, fontWeight: '900', color: '#3F51B5' },

  // Result
  resultBox: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 14, alignItems: 'center', marginVertical: 10 },
  resultLabel: { fontSize: 30, fontWeight: '900', color: '#2E7D32' },
  resultEmojiRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginTop: 6 },

  // Equation
  equationDisplay: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10, marginVertical: 8 },
  equationText: { fontSize: 18, fontWeight: '700', color: '#333' },
  equationResult: { fontWeight: '900', color: '#2E7D32', fontSize: 22 },

  // Success/action
  successBanner: { backgroundColor: '#E8F5E9', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 8 },
  successText: { fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 8 },
  actionBtn: { backgroundColor: '#3F51B5', borderRadius: 24, paddingHorizontal: 24, paddingVertical: 12, marginTop: 10 },
  actionBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  resetBtn: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 2, borderColor: '#4CAF50' },
  resetBtnText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },

  // Groups
  groupsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginVertical: 10 },
  groupBox: { backgroundColor: '#F5F5F5', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', minWidth: 70 },
  groupInner: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 2, marginBottom: 4 },
  groupCount: { fontSize: 18, fontWeight: '900', color: '#9C27B0' },

  // Fraction
  fractionDisplay: { fontSize: 36, fontWeight: '900', color: '#E91E63', marginBottom: 8 },
  fractionBar: { flexDirection: 'row', height: 50, borderWidth: 3, borderColor: '#E91E63', borderRadius: 8, overflow: 'hidden', width: '85%', marginVertical: 10 },
  fractionPiece: { flex: 1, borderRightColor: '#E91E63', backgroundColor: '#FCE4EC' },
  fractionPieceShaded: { backgroundColor: '#E91E63' },
  bigFractionDisplay: { alignItems: 'center', marginVertical: 10 },
  bigFractionNum: { fontSize: 48, fontWeight: '900', color: '#E91E63' },
  fractionLine: { height: 4, backgroundColor: '#E91E63', width: 56, marginVertical: 4 },
  bigFractionDen: { fontSize: 48, fontWeight: '900', color: '#E91E63' },
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%' },
  compareSide: { flex: 1, alignItems: 'center' },
  compareLabel: { fontSize: 20, fontWeight: '900', color: '#E91E63', marginBottom: 6 },
  vsText: { fontSize: 18, fontWeight: '800', color: '#666' },

  // Times table
  tableRow: { flexDirection: 'row', backgroundColor: '#EDE7F6', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, marginVertical: 3, alignSelf: 'stretch' },
  tableText: { fontSize: 16, fontWeight: '700', color: '#4A148C' },
  tableResult: { fontWeight: '900', color: '#7B1FA2', fontSize: 18 },

  // Number line
  numberLineContainer: { width: '90%', height: 80, marginVertical: 16, position: 'relative' },
  numberLine: { position: 'absolute', top: 28, left: 0, right: 0, height: 3, backgroundColor: '#3F51B5' },
  numberTick: { position: 'absolute', top: 18, alignItems: 'center' },
  tick: { width: 2, height: 20, backgroundColor: '#3F51B5' },
  tickLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  numberMarker: { position: 'absolute', top: -2 },
  markerText: { fontSize: 26 },

  // Word problem
  storyBox: { backgroundColor: '#FFF8E1', borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#FFC107', width: '100%' },
  storyText: { fontSize: 15, color: '#5D4037', lineHeight: 22, fontStyle: 'italic' },
  keywordBox: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, backgroundColor: '#E8EAF6', borderRadius: 10, padding: 10, marginBottom: 10 },
  keywordLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  keywordText: { fontSize: 14, fontWeight: '800', color: '#3F51B5' },
  keywordHint: { fontSize: 14, fontWeight: '800', color: '#E91E63' },
  keywordGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  keywordCategory: { alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10, width: '45%' },
  keywordCatLabel: { fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 6 },
  keywordPill: { backgroundColor: '#3F51B5', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  keywordPillText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  problemEmoji: { fontSize: 30, marginRight: 8 },

  // Place value
  bigNumber: { fontSize: 60, fontWeight: '900', color: '#795548', marginBottom: 12 },
  placeValueRow: { flexDirection: 'row', gap: 20 },
  placeColumn: { alignItems: 'center' },
  placeLabel: { fontSize: 16, fontWeight: '800', color: '#795548', marginBottom: 8 },
  tensBlock: { flexDirection: 'row', flexWrap: 'wrap', width: 44, gap: 2, backgroundColor: '#795548', borderRadius: 4, padding: 3, marginBottom: 4 },
  unitBlock: { width: 8, height: 12, backgroundColor: '#FFF8E1', borderRadius: 1 },
  onesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  onesBlock: { width: 20, height: 20, backgroundColor: '#795548', borderRadius: 4 },
  placeCount: { fontSize: 22, fontWeight: '900', color: '#795548' },

  // Shape
  shapeName: { fontSize: 28, fontWeight: '900', color: '#333', marginTop: 14 },
  shapeInfo: { fontSize: 15, color: '#666', marginTop: 6 },

  // Reading
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginVertical: 8 },
  wordChip: { backgroundColor: '#E8EAF6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  wordChipText: { fontSize: 18, fontWeight: '800', color: '#3F51B5' },
  sentenceContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10, paddingHorizontal: 8 },
  sentenceWord: { fontSize: 17, color: '#333', lineHeight: 28 },
  sightWordHighlight: { fontWeight: '900', color: '#E65100', backgroundColor: '#FFF3E0', borderRadius: 4, overflow: 'hidden' },
  sceneSentenceEmoji: { fontSize: 40, marginBottom: 10 },
  tipBox: { backgroundColor: '#FFF3E0', borderRadius: 10, padding: 10, marginTop: 8 },
  tipText: { fontSize: 14, color: '#E65100', fontWeight: '600', textAlign: 'center' },
  blendRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 10 },
  letterBlock: { width: 44, height: 52, borderRadius: 10, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#C5CAE9' },
  letterBlockActive: { backgroundColor: '#3F51B5', borderColor: '#3F51B5' },
  letterText: { fontSize: 26, fontWeight: '900', color: '#3F51B5' },
  letterTextActive: { color: '#fff' },
  resultWordBox: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 14, alignItems: 'center', marginVertical: 10 },
  resultWord: { fontSize: 32, fontWeight: '900', color: '#2E7D32' },
  resultEmoji: { fontSize: 36, marginTop: 6 },
  storyPartBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginVertical: 5, width: '90%', gap: 12 },
  storyPartNumber: { fontSize: 24, fontWeight: '900', color: '#fff', width: 32 },
  storyPartText: { fontSize: 18, fontWeight: '800', color: '#fff' },
});

export default AnimationScene;
