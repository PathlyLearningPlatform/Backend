import { Article } from '../../activities/articles/article.aggregate';
import { ActivityId } from '../../activities/value-objects/id.vo';
import { ActivityName } from '../../activities/value-objects/name.vo';
import { ActivityDescription } from '../../activities/value-objects/description.vo';
import { ActivityType } from '../../activities/value-objects/type.vo';
import { LessonId } from '../../lessons/value-objects/id.vo';
import { UUID } from '../../common/value-objects/uuid.vo';
import { Order } from '../../common/value-objects/order.vo';
import { Url } from '../../common/value-objects/url.vo';

const makeUuid = (value: string) => new UUID({ value });

const makeActivityId = (value = '123e4567-e89b-42d3-a456-426614174000') =>
	new ActivityId({ value: makeUuid(value) });

const makeLessonId = (value = '223e4567-e89b-42d3-a456-426614174000') =>
	new LessonId({ value: makeUuid(value) });

describe('Article aggregate', () => {
	describe('create', () => {
		it('creates an article with all props', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const id = makeActivityId();
			const lessonId = makeLessonId();
			const ref = Url.create('https://example.com/article');

			const article = Article.create(id, {
				lessonId,
				name: ActivityName.create('My Article'),
				description: ActivityDescription.create('A description'),
				createdAt,
				order: Order.create(0),
				ref,
			});

			expect(article.id).toBe(id);
			expect(article.lessonId).toBe(lessonId);
			expect(article.name.value).toBe('My Article');
			expect(article.description?.value).toBe('A description');
			expect(article.createdAt).toBe(createdAt);
			expect(article.updatedAt).toBeNull();
			expect(article.order.value).toBe(0);
			expect(article.type).toBe(ActivityType.ARTICLE);
			expect(article.ref.value).toBe('https://example.com/article');
		});

		it('sets description to null when not provided', () => {
			const article = Article.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Article'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
				ref: Url.create('https://example.com/article'),
			});

			expect(article.description).toBeNull();
		});
	});

	describe('fromDataSource', () => {
		it('reconstructs an article from raw data', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const updatedAt = new Date('2026-03-10T13:00:00.000Z');
			const id = makeActivityId();
			const lessonId = makeLessonId();

			const article = Article.fromDataSource({
				id: id.value,
				lessonId: lessonId.value,
				name: 'My Article',
				description: 'A description',
				createdAt,
				updatedAt,
				order: 1,
				ref: 'https://example.com/article',
			});

			expect(article.id.value).toBe(id.value);
			expect(article.lessonId.value).toBe(lessonId.value);
			expect(article.name.value).toBe('My Article');
			expect(article.description?.value).toBe('A description');
			expect(article.createdAt).toBe(createdAt);
			expect(article.updatedAt).toBe(updatedAt);
			expect(article.order.value).toBe(1);
			expect(article.type).toBe(ActivityType.ARTICLE);
			expect(article.ref.value).toBe('https://example.com/article');
		});

		it('sets description to null when null is provided', () => {
			const article = Article.fromDataSource({
				id: makeActivityId().value,
				lessonId: makeLessonId().value,
				name: 'Article',
				description: null,
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				updatedAt: null,
				order: 0,
				ref: 'https://example.com/article',
			});

			expect(article.description).toBeNull();
		});
	});

	describe('update', () => {
		it('updates name, description, ref and sets updatedAt', () => {
			const now = new Date('2026-03-10T12:05:00.000Z');
			const article = Article.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Old Name'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
				ref: Url.create('https://example.com/old'),
			});

			article.update(now, {
				name: ActivityName.create('New Name'),
				description: ActivityDescription.create('New Desc'),
				ref: Url.create('https://example.com/new'),
			});

			expect(article.name.value).toBe('New Name');
			expect(article.description?.value).toBe('New Desc');
			expect(article.ref.value).toBe('https://example.com/new');
			expect(article.updatedAt).toBe(now);
		});

		it('sets updatedAt even when no props provided', () => {
			const article = Article.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Article'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
				ref: Url.create('https://example.com/article'),
			});
			const now = new Date('2026-03-10T12:05:00.000Z');

			article.update(now);

			expect(article.updatedAt).toBe(now);
		});
	});
});
