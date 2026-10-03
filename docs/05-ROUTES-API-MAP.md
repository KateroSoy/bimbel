# 05 — Routes / API Map

All under `/api`, JSON, `Authorization: Bearer <token>` unless marked public.

## Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | public, throttled; returns `{token, user}` |
| POST | `/auth/register` | public; creates a `siswa` user + student row |
| POST | `/auth/forgot-password` | public; mails reset link |
| POST | `/auth/reset-password` | public; token + new password |
| POST | `/auth/logout` | revokes current token |
| GET | `/me` | current user (+ student code for siswa) |
| PUT | `/me` | name, email, phone, profile fields |
| PUT | `/me/password` | current + new password |

## Resources (generic)
| Method | Path |
|---|---|
| GET | `/r/{resource}` — `?q=`, `?filter[col]=value` |
| POST | `/r/{resource}` |
| PUT | `/r/{resource}/{id}` |
| DELETE | `/r/{resource}/{id}` |

Resource names and their access live in `backend/config/resources.php` (see `04-DATABASE-SCHEMA.md`).

## Student
| Method | Path | Notes |
|---|---|---|
| GET | `/student/portal` | profile, subjects, live classes, courses with progress, attendance, bills, announcements, task content |
| POST | `/student/lessons/{lesson}/complete` | enrollment required |
| DELETE | `/student/lessons/{lesson}/complete` | undo |
| POST | `/student/bills/{bill}/pay` | sets verification pending |

## Courses (tutor / admin)
| Method | Path |
|---|---|
| GET | `/courses/{course}/modules` |
| POST | `/courses/{course}/modules` |
| PUT / DELETE | `/modules/{module}` |
| POST | `/modules/{module}/lessons` |
| PUT / DELETE | `/lessons/{lesson}` |
| POST / DELETE | `/courses/{course}/enrollments` (student id in body) — admin |

## Admin
| GET | `/admin/dashboard` | counts and sums for the dashboard |

## Settings
| GET | `/settings` | PUT `/settings` (admin) |

## Screen → data
- Admin list pages → `/r/<resource>` (`useCrud('<resource>')`).
- Tutor pages → `/r/<resource>`; Tugas → `/r/assignments`, `/r/submissions`.
- Student pages → `/student/portal` + `/r/assignments`, `/r/submissions`.
