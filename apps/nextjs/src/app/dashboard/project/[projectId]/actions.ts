"use client";

import { createClient } from "~/utils/supabase/client";

export async function UploadFile(fileName: string, file: File) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from("project_files")
        .upload(fileName, file);

    return { data, error };
}

export async function GetSignedURL(fullPath: string) {
    const supabase = createClient();

    const inAnHour = 60 * 60;
    const { data, error } = await supabase.storage
        .from("project_files")
        .createSignedUrl(fullPath, inAnHour, {
            download: true,
        });

    return { data, error };
}
