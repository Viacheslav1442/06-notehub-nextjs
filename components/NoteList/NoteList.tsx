import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import type { Note } from "../../app/notes/Notes.client";
import css from "../../css/NoteList.module.css";
import Link from "next/link";

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });

    const handleDelete = (id: string) => {
        mutation.mutate(id);
    };

    return (
        <ul className={css.list}>
            {notes.map((item) => (
                <li key={item.id} className={css.listItem}>
                    <h2 className={css.title}>{item.title}</h2>
                    <p className={css.content}>{item.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{item.tag}</span>


                        <Link href={`/notes/${item.id}`} className={css.detailsLink}>
                            View details
                        </Link>

                        <button
                            className={css.button}
                            onClick={() => handleDelete(item.id)}
                            disabled={mutation.status === "pending"}
                        >
                            {mutation.status === "pending" ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}