// ============================================================
// useQuestionType — Question type helpers composable
// ============================================================

import { computed } from 'vue'

/**
 * Provides helpers to determine rendering logic based on question type.
 * Avoids repeating if/switch logic across multiple components.
 *
 */
export function useQuestionType(question) {

    // Whether the question is multiple choice
    const isMultipleChoice = computed(() => question.value?.type === 'multiple_choice')

    // Whether the question is true/false
    const isTrueFalse = computed(() => question.value?.type === 'true_false')

    // Whether the question requires an open text answer
    const isOpen = computed(() => question.value?.type === 'open')

    // Whether the question has selectable options
    const hasOptions = computed(() => isMultipleChoice.value || isTrueFalse.value)

    // Human-readable label for the question type
    const typeLabel = computed(() => {
        const labels = {
            multiple_choice: 'Multiple Choice',
            true_false: 'True / False',
            open: 'Open Answer',
        }
        return labels[question.value?.type] ?? 'Unknown'
    })

    // Badge color for the question type tag
    const typeBadgeColor = computed(() => {
        const colors = {
            multiple_choice: 'bg-blue-100 text-blue-700',
            true_false: 'bg-purple-100 text-purple-700',
            open: 'bg-amber-100 text-amber-700',
        }
        return colors[question.value?.type] ?? 'bg-gray-100 text-gray-600'
    })

    return {
        isMultipleChoice,
        isTrueFalse,
        isOpen,
        hasOptions,
        typeLabel,
        typeBadgeColor,
    }
}