'use client'

import { useState } from 'react'
import {
    Box, Typography, Grid, Stack, Chip, Button,
    LinearProgress, Card, CardContent, Divider, Tabs, Tab,
    List, ListItem, ListItemIcon, ListItemText, Avatar,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import SchoolIcon from '@mui/icons-material/School'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const COURSES = [
    {
        id: '1', title: 'Producción Musical Completa',
        progress: 65, totalLessons: 8, completedLessons: 5,
        hoursTotal: 13, hoursCompleted: 8.5,
        instructor: 'Carlos Medina',
        lessons: [
            { id: '1', title: 'Introducción a la producción musical', duration: '45 min', done: true, free: true },
            { id: '2', title: 'Configuración del entorno de trabajo', duration: '1h 20 min', done: true, free: true },
            { id: '3', title: 'Fundamentos de teoría musical', duration: '2h 15 min', done: true, free: false },
            { id: '4', title: 'Programación de ritmos y beats', duration: '1h 50 min', done: true, free: false },
            { id: '5', title: 'Síntesis y diseño de sonido', duration: '2h 30 min', done: true, free: false },
            { id: '6', title: 'Grabación de instrumentos', duration: '1h 45 min', done: false, free: false, current: true },
            { id: '7', title: 'Mezcla profesional', duration: '3h 10 min', done: false, free: false },
            { id: '8', title: 'Masterización', duration: '2h 00 min', done: false, free: false },
        ],
    },
    {
        id: '4', title: 'FL Studio Completo',
        progress: 0, totalLessons: 12, completedLessons: 0,
        hoursTotal: 20, hoursCompleted: 0,
        instructor: 'Remix Pro',
        lessons: [
            { id: '1', title: 'Introducción a FL Studio', duration: '30 min', done: false, free: true },
            { id: '2', title: 'Interfaz y herramientas', duration: '1h 00 min', done: false, free: false },
        ],
    },
]

const ACHIEVEMENTS = [
    { icon: '🎯', label: 'Primera lección', desc: 'Completaste tu primera lección', earned: true },
    { icon: '🔥', label: 'Racha de 7 días', desc: 'Estudiaste 7 días seguidos', earned: true },
    { icon: '⭐', label: 'Primera compra', desc: 'Compraste tu primer producto', earned: true },
    { icon: '🏆', label: 'Curso completado', desc: 'Completaste un curso entero', earned: false },
    { icon: '💎', label: 'Estudiante dedicado', desc: '5 cursos completados', earned: false },
]

export default function LearningPage() {
    const [selectedCourse, setSelectedCourse] = useState(0)
    const [tab, setTab] = useState(0)
    const course = COURSES[selectedCourse]

    return (
        <Box>
            <Typography variant="h4" fontWeight={800} mb={0.5}>Mi Aprendizaje</Typography>
            <Typography color="text.secondary" mb={4}>Sigue con tu formación y alcanza tus metas</Typography>

            {/* Course Selector */}
            <Stack direction="row" spacing={1.5} mb={3} sx={{ overflowX: 'auto', pb: 0.5 }}>
                {COURSES.map((c, i) => (
                    <Chip
                        key={c.id}
                        label={`${c.title.slice(0, 22)}… ${c.progress}%`}
                        onClick={() => setSelectedCourse(i)}
                        sx={{
                            fontWeight: 600, flexShrink: 0, cursor: 'pointer',
                            background: selectedCourse === i
                                ? 'linear-gradient(135deg, #FF6B35, #FF8C61)'
                                : '#F8F9FA',
                            color: selectedCourse === i ? '#fff' : 'text.primary',
                            border: selectedCourse === i ? 'none' : '1px solid #E9ECEF',
                        }}
                    />
                ))}
            </Stack>

            <Grid container spacing={3}>
                {/* Left: Progress + Lessons */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={2.5} gap={1}>
                                <Box>
                                    <Typography variant="h6" fontWeight={700} mb={0.25}>{course.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">por {course.instructor}</Typography>
                                </Box>
                                <Chip
                                    label={`${course.progress}% completado`}
                                    sx={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35', fontWeight: 700 }}
                                />
                            </Stack>

                            <LinearProgress
                                variant="determinate" value={course.progress}
                                sx={{
                                    height: 10, borderRadius: 5, mb: 1.5, bgcolor: 'rgba(255,107,53,0.1)',
                                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FF6B35, #4ECDC4)', borderRadius: 5 },
                                }}
                            />

                            <Stack direction="row" spacing={3}>
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <CheckCircleIcon sx={{ color: '#28A745', fontSize: 16 }} />
                                    <Typography variant="caption" fontWeight={600}>{course.completedLessons}/{course.totalLessons} lecciones</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <AccessTimeIcon sx={{ color: '#FF6B35', fontSize: 16 }} />
                                    <Typography variant="caption" fontWeight={600}>{course.hoursCompleted}h / {course.hoursTotal}h</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: '2px solid #E9ECEF', mb: 3 }}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}
                            sx={{ '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #FF6B35, #FF8C61)', height: 3, borderRadius: '3px 3px 0 0' } }}>
                            <Tab label="Lecciones" />
                            <Tab label="Logros" />
                        </Tabs>
                    </Box>

                    {tab === 0 && (
                        <Stack spacing={1}>
                            {course.lessons.map((lesson, i) => (
                                <Box
                                    key={lesson.id}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 2, p: 2,
                                        borderRadius: 3, border: '1.5px solid',
                                        borderColor: (lesson as any).current ? '#FF6B35' : lesson.done ? 'rgba(40,167,69,0.25)' : '#E9ECEF',
                                        background: (lesson as any).current ? 'rgba(255,107,53,0.04)' : lesson.done ? 'rgba(40,167,69,0.02)' : '#FFFFFF',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {/* Status Icon */}
                                    <Box sx={{
                                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: lesson.done ? 'rgba(40,167,69,0.12)' : (lesson as any).current ? 'rgba(255,107,53,0.12)' : '#F8F9FA',
                                    }}>
                                        {lesson.done ? (
                                            <CheckCircleIcon sx={{ color: '#28A745', fontSize: 20 }} />
                                        ) : lesson.free || (lesson as any).current ? (
                                            <PlayArrowIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                                        ) : (
                                            <LockIcon sx={{ color: '#ADB5BD', fontSize: 18 }} />
                                        )}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={lesson.done ? 500 : (lesson as any).current ? 700 : 500}
                                            color={lesson.done ? 'text.secondary' : (lesson as any).current ? '#FF6B35' : 'text.primary'}
                                            sx={{ textDecoration: lesson.done ? 'line-through' : 'none' }}>
                                            {i + 1}. {lesson.title}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                                            <Typography variant="caption" color="text.secondary">{lesson.duration}</Typography>
                                            {(lesson as any).current && <Chip label="Continúa aquí" size="small" sx={{ height: 16, fontSize: '0.6rem', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', fontWeight: 700 }} />}
                                        </Stack>
                                    </Box>

                                    {(lesson as any).current && (
                                        <Button variant="contained" size="small"
                                            startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                                            sx={{ fontWeight: 700, borderRadius: 2.5, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', flexShrink: 0 }}>
                                            Ver lección
                                        </Button>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {tab === 1 && (
                        <Grid container spacing={2}>
                            {ACHIEVEMENTS.map((a) => (
                                <Grid item xs={12} sm={6} key={a.label}>
                                    <Box sx={{
                                        p: 2.5, borderRadius: 3, border: '1px solid',
                                        borderColor: a.earned ? 'rgba(255,193,7,0.35)' : '#E9ECEF',
                                        background: a.earned ? 'rgba(255,193,7,0.05)' : '#FAFAFA',
                                        display: 'flex', alignItems: 'center', gap: 2, opacity: a.earned ? 1 : 0.5,
                                    }}>
                                        <Typography sx={{ fontSize: '2rem' }}>{a.icon}</Typography>
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>{a.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">{a.desc}</Typography>
                                        </Box>
                                        {a.earned && <CheckCircleIcon sx={{ color: '#FFC107', ml: 'auto', flexShrink: 0 }} />}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>

                {/* Right: Stats */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={2.5}>
                        {/* Study Stats */}
                        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" fontWeight={700} mb={2.5}>Estadísticas</Typography>
                                {[
                                    { label: 'Racha actual', value: '7 días 🔥', color: '#FF6B35' },
                                    { label: 'Mejor racha', value: '14 días', color: '#4ECDC4' },
                                    { label: 'Cursos activos', value: '2', color: '#A29BFE' },
                                    { label: 'Cursos completados', value: '0', color: '#28A745' },
                                ].map(({ label, value, color }) => (
                                    <Stack key={label} direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography variant="body2" color="text.secondary">{label}</Typography>
                                        <Typography variant="body2" fontWeight={700} color={color}>{value}</Typography>
                                    </Stack>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Next milestone */}
                        <Box sx={{
                            p: 3, borderRadius: 4,
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 60%, #4ECDC4)',
                            color: '#fff',
                        }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                                <EmojiEventsIcon sx={{ fontSize: 28 }} />
                                <Typography fontWeight={700}>Próximo logro</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5 }}>
                                Completa 3 lecciones más para desbloquear "Medio camino"
                            </Typography>
                            <LinearProgress variant="determinate" value={62}
                                sx={{
                                    height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.25)',
                                    '& .MuiLinearProgress-bar': { bgcolor: '#FFFFFF', borderRadius: 4 },
                                }}
                            />
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}
