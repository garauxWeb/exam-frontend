// ============================================================
// useTimer — Reusable countdown timer composable
// ============================================================

import { ref, computed, onUnmounted } from 'vue'

/**
 * Reusable countdown timer.
 * Decoupled from the store — can be used in any component that needs a timer.
 *
 * Wiederverwendbarer Countdown-Timer.
 * Vom Store entkoppelt — kann in jeder Komponente verwendet werden die einen Timer benötigt.
 */
export function useTimer() {
    // Seconds remaining
    const timeLeft = ref(0)

    // Total seconds for the current question — used to calculate percentage
    const totalSeconds = ref(0)

    // Internal interval reference
    const intervalRef = ref(null)

    // Whether the timer is currently running
    const isRunning = ref(false)

    // Callback fired when the timer reaches zero
    let onExpireCallback = null

    // ── Computed ──────────────────────────────────────────────

    // Percentage remaining for the visual progress bar (100 → 0)
    const percentage = computed(() => {
        if (totalSeconds.value === 0) return 0
        return Math.round((timeLeft.value / totalSeconds.value) * 100)
    })

    // Color changes from green → yellow → red as time runs out
    const timerColor = computed(() => {
        if (percentage.value > 50) return 'bg-emerald-500'
        if (percentage.value > 25) return 'bg-amber-400'
        return 'bg-red-500'
    })

    // ── Methods ───────────────────────────────────────────────

    // Start the timer with a given number of seconds
    function start(seconds, onExpire) {
        stop()
        timeLeft.value = seconds
        totalSeconds.value = seconds
        isRunning.value = true
        onExpireCallback = onExpire

        intervalRef.value = setInterval(() => {
            if (timeLeft.value > 0) {
                timeLeft.value--
            } else {
                stop()
                // Fire the expire callback when time runs out
                if (onExpireCallback) onExpireCallback()
            }
        }, 1000)
    }

    // Stop and clear the timer
    function stop() {
        if (intervalRef.value) {
            clearInterval(intervalRef.value)
            intervalRef.value = null
        }
        isRunning.value = false
    }

    // Reset the timer to zero
    function reset() {
        stop()
        timeLeft.value = 0
        totalSeconds.value = 0
    }

    // Auto-cleanup when the component is unmounted
    onUnmounted(() => stop())

    return {
        timeLeft,
        percentage,
        timerColor,
        isRunning,
        start,
        stop,
        reset,
    }
}