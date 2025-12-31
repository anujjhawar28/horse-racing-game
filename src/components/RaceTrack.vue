<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import type { HorseRaceState } from "@/types";
import { RaceStatus } from "@/types";

const store = useStore();

const currentRound = computed(() => store.getters.currentRound);
const raceState = computed(() => store.getters.currentRaceState);
const isRacing = computed(() => store.getters.isRacing);
const currentRoundNumber = computed(() => store.getters.currentRoundNumber);

function getProgress(horseState: HorseRaceState): number {
  if (!currentRound.value) return 0;
  const progress = (horseState.position / currentRound.value.distance) * 100;
  return Math.min(progress, 100);
}

function getPositionLabel(rank: number | null): string {
  if (rank === null) return "";
  const suffixes = ["th", "st", "nd", "rd"];
  const v = rank % 100;
  return rank + (suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0] ?? 'th');
}
</script>

<template>
  <div class="race-track">
    <div class="race-track__header">
      <h2 class="race-track__title">🏁 Race Track</h2>
      <div v-if="currentRound" class="race-track__info">
        <span class="race-track__round">Round {{ currentRoundNumber }}</span>
        <span class="race-track__distance">{{ currentRound.distance }}m</span>
        <span
          v-if="currentRound.status === RaceStatus.RUNNING"
          class="race-track__status race-track__status--running"
        >
          Racing!
        </span>
        <span
          v-else-if="currentRound.status === RaceStatus.FINISHED"
          class="race-track__status race-track__status--finished"
        >
          Finished!
        </span>
      </div>
    </div>

    <div v-if="!raceState.length" class="race-track__empty">
      <div class="race-track__empty-icon">🏇</div>
      <p>Generate a program and start the race to see horses compete!</p>
    </div>

    <div v-else class="race-track__lanes">
      <div
        v-for="(horseState, index) in raceState"
        :key="horseState.horse.id"
        class="lane"
        :class="{ 'lane--finished': horseState.finished }"
      >
        <div class="lane__number">{{ Number(index) + 1 }}</div>
        
        <div class="lane__content">
          <div class="lane__header">
            <div class="lane__info">
              <span
                class="lane__color"
                :style="{ backgroundColor: horseState.horse.color }"
              />
              <span class="lane__name">{{ horseState.horse.name }}</span>
              <span class="lane__condition" title="Condition">
                ⚡{{ horseState.horse.condition }}
              </span>
            </div>

            <div class="lane__result">
              <span
                v-if="horseState.finished"
                class="lane__rank"
                :class="{
                  'lane__rank--gold': horseState.rank === 1,
                  'lane__rank--silver': horseState.rank === 2,
                  'lane__rank--bronze': horseState.rank === 3,
                }"
              >
                {{ getPositionLabel(horseState.rank) }}
              </span>
              <span v-else class="lane__progress">
                {{ Math.floor(getProgress(horseState)) }}%
              </span>
            </div>
          </div>

          <div class="lane__track">
            <div class="lane__track-bg">
              <div class="lane__marking" style="left: 25%"></div>
              <div class="lane__marking" style="left: 50%"></div>
              <div class="lane__marking" style="left: 75%"></div>
            </div>

            <div
              class="lane__horse"
              :style="{
                left: `${getProgress(horseState)}%`,
                backgroundColor: horseState.horse.color,
              }"
              :class="{ 'lane__horse--racing': !horseState.finished && isRacing }"
            >
              <span class="lane__horse-icon">🏇</span>
            </div>

            <div class="lane__finish-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-track {
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.race-track__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.race-track__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
}

.race-track__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.race-track__round {
  font-weight: 600;
  color: var(--accent-color, #3498db);
  background: var(--accent-bg, #e8f4fc);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.race-track__distance {
  font-weight: 500;
  color: var(--text-secondary, #666666);
  font-size: 14px;
}

.race-track__status {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.race-track__status--running {
  background: #fff3cd;
  color: #856404;
  animation: pulse-status 1s infinite;
}

.race-track__status--finished {
  background: #d4edda;
  color: #155724;
}

@keyframes pulse-status {
  50% {
    opacity: 0.7;
  }
}

.race-track__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  text-align: center;
}

.race-track__empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.race-track__lanes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 8px;
}

.lane {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 8px 12px;
  background: var(--card-bg, #ffffff);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.lane__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: auto;
  min-height: 60px;
  background: var(--accent-color, #3498db);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border-radius: 6px;
  flex-shrink: 0;
}

.lane__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.lane__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lane--finished {
  background: var(--lane-finished-bg, #f0fff4);
}

.lane--finished .lane__number {
  background: var(--success-color, #2ecc71);
}

.lane__info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  flex-shrink: 0;
}

.lane__color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lane__name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

.lane__condition {
  font-size: 11px;
  color: var(--text-secondary, #666666);
  background: var(--condition-bg, #f0f0f0);
  padding: 2px 6px;
  border-radius: 8px;
}

.lane__track {
  width: 100%;
  height: 32px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.lane__track-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #8b4513 0%,
    #a0522d 25%,
    #8b4513 50%,
    #a0522d 75%,
    #8b4513 100%
  );
  border-radius: 4px;
}

.lane__marking {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.lane__horse {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.05s linear;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.lane__horse--racing {
  animation: bounce 0.2s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translate(-50%, -50%) translateY(-1px);
  }
  to {
    transform: translate(-50%, -50%) translateY(1px);
  }
}

.lane__horse-icon {
  font-size: 20px;
  filter: grayscale(1) brightness(2);
}

.lane__finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: repeating-linear-gradient(
    to bottom,
    #000 0px,
    #000 4px,
    #fff 4px,
    #fff 8px
  );
  z-index: 1;
}

.lane__result {
  min-width: 50px;
  text-align: right;
  flex-shrink: 0;
}

.lane__rank {
  font-weight: 700;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--rank-bg, #f0f0f0);
}

.lane__rank--gold {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #000;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.lane__rank--silver {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #000;
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
}

.lane__rank--bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: #fff;
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
}

.lane__progress {
  font-size: 12px;
  color: var(--text-secondary, #666666);
  font-weight: 500;
}
</style>
