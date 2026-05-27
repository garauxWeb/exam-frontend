import { createRouter, createWebHistory } from 'vue-router'

const routes = [

    // ── Redirect root to teacher dashboard ──
    {
        path: '/',
        component: () => import('@/pages/index.vue'),
    },

    // ── Teacher routes ──
    {
        path: '/teacher',
        name: 'teacher-dashboard',
        component: () => import('@/pages/teacher/index.vue'),
    },
    {
        path: '/teacher/exams/create',
        name: 'exam-create',
        component: () => import('@/views/teacher/ExamBuilderView.vue'),
    },
    {
        path: '/teacher/exams/:id',
        name: 'exam-edit',
        component: () => import('@/views/teacher/ExamBuilderView.vue'),
    },

    // ── Student routes ──
    {
        path: '/student',
        name: 'student-home',
        component: () => import('@/pages/student/index.vue'),
    },
    {
        path: '/student/exam/:examId',
        name: 'student-welcome',
        component: () => import('@/views/student/WelcomeView.vue'),
    },
    {
        path: '/student/quiz/:sessionId',
        name: 'student-quiz',
        component: () => import('@/views/student/QuizView.vue'),
    },
    {
        path: '/student/results/:sessionId',
        name: 'student-results',
        component: () => import('@/views/student/ResultView.vue'),
    },

    // ── 404 fallback ──
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        redirect: '/',
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router