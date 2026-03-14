import { pool } from '../../config/db';

export const getSubjectVideos = async (subjectId: number) => {
    const [rows] = await pool.query(
        `SELECT s.id as section_id, s.title as section_title, s.order_index as section_order,
                v.id as video_id, v.title as video_title, v.youtube_url, v.order_index as video_order, v.duration_seconds 
         FROM sections s
         LEFT JOIN videos v ON s.id = v.section_id
         WHERE s.subject_id = ?
         ORDER BY s.order_index ASC, v.order_index ASC`,
        [subjectId]
    );

    const flatRows = rows as any[];

    // Transform flat rows into a nested structure for the frontend
    const sectionsObj: Record<number, any> = {};

    flatRows.forEach(row => {
        if (!sectionsObj[row.section_id]) {
            sectionsObj[row.section_id] = {
                id: row.section_id,
                title: row.section_title,
                order_index: row.section_order,
                videos: []
            };
        }

        if (row.video_id) {
            sectionsObj[row.section_id].videos.push({
                id: row.video_id,
                title: row.video_title,
                youtube_url: row.youtube_url,
                order_index: row.video_order,
                duration_seconds: row.duration_seconds
            });
        }
    });

    return Object.values(sectionsObj).sort((a: any, b: any) => a.order_index - b.order_index);
};
