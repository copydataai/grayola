"use client";

import { createClient } from "~/utils/supabase/client";

export async function UploadFile(fileName: string, file: File) {
    const supabase = createClient();
    console.log("actions", fileName, file);
    const { data, error } = await supabase.storage
        .from("project_files")
        .upload(fileName, file);

    return { data, error };
}

export async function GetSignedURL(fullPath: string) {
    const supabase = createClient();

    const inAYear = 60 * 60 * 24 * 365;
    const { data, error } = await supabase.storage
        .from("project_files")
        .createSignedUrl(fullPath, inAYear, {
            download: true,
        });

    return { data, error };
}
