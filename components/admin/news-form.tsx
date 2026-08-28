"use client";

import { useActionState } from "react";
import type { NewsArticle, Category } from "@prisma/client";
import { saveNews, type AdminFormState } from "@/app/admin/actions";
import { FieldError, CoverImageField, CheckRow } from "./form-ui";

const initial: AdminFormState = { ok: false };

export function NewsForm({
  article,
  categories,
}: {
  article?: NewsArticle;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(saveNews, initial);

  return (
    <form action={action} className="space-y-5">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div>
        <label htmlFor="title" className="label">Headline</label>
        <input id="title" name="title" required defaultValue={article?.title} className="input" placeholder="Story headline…" />
        <FieldError errors={state.errors?.title} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="label">Slug <span className="font-normal text-mute">(optional — auto-generated)</span></label>
          <input id="slug" name="slug" defaultValue={article?.slug} className="input" placeholder="my-story-slug" />
          <FieldError errors={state.errors?.slug} />
        </div>
        <div>
          <label htmlFor="author" className="label">Author</label>
          <input id="author" name="author" defaultValue={article?.author ?? "Khulna Bites Desk"} className="input" />
          <FieldError errors={state.errors?.author} />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="label">Excerpt</label>
        <textarea id="excerpt" name="excerpt" required rows={2} defaultValue={article?.excerpt} className="input resize-none" placeholder="One or two sentences shown on cards…" />
        <FieldError errors={state.errors?.excerpt} />
      </div>

      <div>
        <label htmlFor="content" className="label">Article content</label>
        <textarea id="content" name="content" required rows={10} defaultValue={article?.content} className="input resize-y" placeholder="Write the story. Blank line between paragraphs." />
        <FieldError errors={state.errors?.content} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryId" className="label">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={article?.categoryId ?? ""} className="input">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="externalUrl" className="label">External article URL <span className="font-normal text-mute">(optional)</span></label>
          <input id="externalUrl" name="externalUrl" type="url" defaultValue={article?.externalUrl ?? ""} className="input" placeholder="https://…" />
          <p className="mt-1 text-xs text-mute">If set, readers see a “Read Full Article →” button.</p>
          <FieldError errors={state.errors?.externalUrl} />
        </div>
      </div>

      <CoverImageField existing={article?.coverImage} error={state.errors?.coverImage} />

      <div className="grid gap-3 sm:grid-cols-2">
        <CheckRow name="published" label="Published" hint="Visible on the public site" defaultChecked={article?.published ?? true} />
        <CheckRow name="featured" label="Featured" hint="Highlighted on the homepage" defaultChecked={article?.featured ?? false} />
      </div>

      {state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}

      <div className="flex gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : article ? "Save changes" : "Publish article"}
        </button>
        <a href="/admin/news" className="btn-outline">Cancel</a>
      </div>
    </form>
  );
}
