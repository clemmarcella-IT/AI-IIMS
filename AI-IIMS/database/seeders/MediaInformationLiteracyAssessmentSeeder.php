<?php

namespace Database\Seeders;

use App\Models\Test;
use Illuminate\Database\Seeder;

class MediaInformationLiteracyAssessmentSeeder extends Seeder
{
    private const SUBJECT = 'Media and Information Literacy';

    private const TOPIC = 'Core Concepts of Media and Information Literacy';

    /**
     * Seed the Media and Information Literacy pretest and posttest assessments.
     */
    public function run(): void
    {
        $pretest = Test::query()->updateOrCreate(
            [
                'test_type' => 'pretest',
                'subject' => self::SUBJECT,
                'topic' => self::TOPIC,
            ],
            [
                'title' => 'Pretest: Media and Information Literacy',
                'is_active' => true,
            ],
        );

        $posttest = Test::query()->updateOrCreate(
            [
                'test_type' => 'posttest',
                'subject' => self::SUBJECT,
                'topic' => self::TOPIC,
            ],
            [
                'title' => 'Posttest: Media and Information Literacy',
                'is_active' => true,
            ],
        );

        $this->deactivateOtherTests($pretest);
        $this->deactivateOtherTests($posttest);

        $pretest->questions()->delete();
        $posttest->questions()->delete();

        $this->createQuestions($pretest, $this->pretestQuestions());
        $this->createQuestions($posttest, $this->posttestQuestions());
    }

    private function deactivateOtherTests(Test $test): void
    {
        Test::query()
            ->whereKeyNot($test->id)
            ->where('test_type', $test->test_type)
            ->update(['is_active' => false]);
    }

    private function createQuestions(Test $test, array $questions): void
    {
        foreach ($questions as $question) {
            $test->questions()->create($question);
        }
    }

    private function pretestQuestions(): array
    {
        return [
            [
                'question' => 'What does media literacy mainly help a learner do?',
                'choices' => [
                    'A' => 'Access, analyze, evaluate, create, and act using media messages.',
                    'B' => 'Memorize all posts from social media platforms.',
                    'C' => 'Avoid every form of digital communication.',
                    'D' => 'Share information quickly without checking it.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Media literacy involves understanding, evaluating, and responsibly creating media messages.',
                'points' => 1,
            ],
            [
                'question' => 'Which statement best describes information literacy?',
                'choices' => [
                    'A' => 'The ability to find, evaluate, use, and communicate information effectively.',
                    'B' => 'The ability to copy online information without citing sources.',
                    'C' => 'The skill of making entertainment videos only.',
                    'D' => 'The practice of believing the first result in a search engine.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Information literacy focuses on locating, judging, using, and sharing information responsibly.',
                'points' => 1,
            ],
            [
                'question' => 'A student checks the author, date, evidence, and purpose of an article. What skill is being used?',
                'choices' => [
                    'A' => 'Source evaluation.',
                    'B' => 'Plagiarism.',
                    'C' => 'Clickbait writing.',
                    'D' => 'File compression.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Checking authorship, timeliness, evidence, and purpose helps evaluate whether a source is reliable.',
                'points' => 1,
            ],
            [
                'question' => 'Which example is a traditional media form?',
                'choices' => [
                    'A' => 'Newspaper.',
                    'B' => 'Livestream chat.',
                    'C' => 'Podcast app comment section.',
                    'D' => 'Social networking profile.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Newspapers are a traditional form of mass media, unlike newer interactive digital platforms.',
                'points' => 1,
            ],
            [
                'question' => 'Which example is new media?',
                'choices' => [
                    'A' => 'A video-sharing platform where users upload and comment on videos.',
                    'B' => 'A printed magazine sold monthly.',
                    'C' => 'A radio drama broadcast on AM radio.',
                    'D' => 'A poster displayed on a school bulletin board.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'New media is usually digital, interactive, networked, and often user-generated.',
                'points' => 1,
            ],
            [
                'question' => 'What is bias in media or information?',
                'choices' => [
                    'A' => 'A tendency to present information from a particular viewpoint.',
                    'B' => 'A rule that all sources must be neutral.',
                    'C' => 'A list of complete references.',
                    'D' => 'A signal that information is always false.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Bias means a message may favor a viewpoint, group, or interpretation.',
                'points' => 1,
            ],
            [
                'question' => 'Which action is the best response before sharing a shocking online claim?',
                'choices' => [
                    'A' => 'Verify it with credible and independent sources.',
                    'B' => 'Share it immediately before others do.',
                    'C' => 'Trust it if it has many reactions.',
                    'D' => 'Ignore the headline and read only the comments.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Responsible users verify claims before sharing, especially when content is emotional or surprising.',
                'points' => 1,
            ],
            [
                'question' => 'What is plagiarism?',
                'choices' => [
                    'A' => 'Using another person\'s words or ideas without proper credit.',
                    'B' => 'Summarizing a source and citing it correctly.',
                    'C' => 'Creating an original photo for a project.',
                    'D' => 'Asking permission to use copyrighted material.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Plagiarism happens when someone presents another person\'s work or ideas as their own.',
                'points' => 1,
            ],
            [
                'question' => 'Which behavior shows responsible digital citizenship?',
                'choices' => [
                    'A' => 'Respecting others online and protecting personal information.',
                    'B' => 'Posting private photos of classmates without consent.',
                    'C' => 'Using insults to win an online argument.',
                    'D' => 'Sharing passwords with friends for convenience.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Digital citizenship includes respect, safety, privacy, and ethical participation online.',
                'points' => 1,
            ],
            [
                'question' => 'Why is it important to know the purpose of a media message?',
                'choices' => [
                    'A' => 'It helps identify whether the message informs, persuades, entertains, or sells.',
                    'B' => 'It proves the message has no bias.',
                    'C' => 'It makes all advertisements disappear.',
                    'D' => 'It replaces the need to check evidence.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Understanding purpose helps audiences interpret how and why a message was created.',
                'points' => 1,
            ],
        ];
    }

    private function posttestQuestions(): array
    {
        return [
            [
                'question' => 'A classmate sends a viral post claiming a celebrity died, but no trusted news outlet reports it. What should you do first?',
                'choices' => [
                    'A' => 'Check reliable sources before reacting or sharing.',
                    'B' => 'Forward it because it is already viral.',
                    'C' => 'Post a comment saying it must be true.',
                    'D' => 'Use the post as a source for a report.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Viral content still needs verification from credible, independent sources.',
                'points' => 1,
            ],
            [
                'question' => 'A website article has no author, no publication date, many spelling errors, and no evidence. What is the best judgment?',
                'choices' => [
                    'A' => 'The source needs careful checking and may not be reliable.',
                    'B' => 'The source is reliable because it is online.',
                    'C' => 'The source is reliable because it is easy to read.',
                    'D' => 'The source should be copied without citation.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Missing authorship, date, evidence, and quality control are warning signs when evaluating sources.',
                'points' => 1,
            ],
            [
                'question' => 'Which project choice best shows ethical use of information?',
                'choices' => [
                    'A' => 'Paraphrasing a source, adding your own explanation, and citing the source.',
                    'B' => 'Copying full paragraphs without quotation marks or citation.',
                    'C' => 'Removing the author\'s name from an image found online.',
                    'D' => 'Submitting a downloaded essay as your own work.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Ethical use requires original work, accurate representation, and proper attribution.',
                'points' => 1,
            ],
            [
                'question' => 'An advertisement uses an influencer you admire to make a product look trustworthy. Which media concept should you notice?',
                'choices' => [
                    'A' => 'Persuasive technique.',
                    'B' => 'Database backup.',
                    'C' => 'Random sampling only.',
                    'D' => 'Neutral reporting.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Endorsements and appeals to admiration are persuasive techniques often used in advertising.',
                'points' => 1,
            ],
            [
                'question' => 'A news report includes facts, while an opinion column argues for one position. What should a media-literate reader do?',
                'choices' => [
                    'A' => 'Recognize the difference between factual reporting and opinion.',
                    'B' => 'Treat both texts as automatically false.',
                    'C' => 'Ignore the evidence in both texts.',
                    'D' => 'Assume opinions never use facts.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Media-literate readers distinguish factual claims from interpretations, arguments, and opinions.',
                'points' => 1,
            ],
            [
                'question' => 'Which online action best protects your digital footprint?',
                'choices' => [
                    'A' => 'Thinking carefully before posting personal details or photos.',
                    'B' => 'Posting your address so friends can find you easily.',
                    'C' => 'Using the same public password for all accounts.',
                    'D' => 'Accepting every friend request from strangers.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'A digital footprint can last, so users should protect privacy and consider long-term effects.',
                'points' => 1,
            ],
            [
                'question' => 'A photo online has been cropped so viewers cannot see important context. What does this show?',
                'choices' => [
                    'A' => 'Media messages can be constructed to influence interpretation.',
                    'B' => 'Photos always show the complete truth.',
                    'C' => 'Cropping makes information more objective.',
                    'D' => 'Context is never needed for visual media.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Media creators choose what to include or exclude, and those choices shape meaning.',
                'points' => 1,
            ],
            [
                'question' => 'Which search strategy is most useful for a research task on cyberbullying laws in the Philippines?',
                'choices' => [
                    'A' => 'Use specific keywords and compare government, legal, and educational sources.',
                    'B' => 'Use only one social media comment thread.',
                    'C' => 'Choose the first result without reading it.',
                    'D' => 'Avoid checking the date of any source.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Effective research uses focused keywords and compares credible sources suited to the topic.',
                'points' => 1,
            ],
            [
                'question' => 'A student sees a meme that stereotypes a group of people. What is the most media-literate response?',
                'choices' => [
                    'A' => 'Question the message, avoid spreading harm, and consider its impact.',
                    'B' => 'Share it if it is funny.',
                    'C' => 'Assume humor cannot cause harm.',
                    'D' => 'Judge the whole group based on the meme.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Media literacy includes recognizing representation, stereotypes, and the social impact of messages.',
                'points' => 1,
            ],
            [
                'question' => 'Which statement best summarizes a responsible MIL learner?',
                'choices' => [
                    'A' => 'A person who critically evaluates messages and creates information ethically.',
                    'B' => 'A person who believes popular content without checking it.',
                    'C' => 'A person who avoids all media and technology.',
                    'D' => 'A person who values speed over accuracy.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Responsible MIL learners think critically, verify information, respect others, and create ethically.',
                'points' => 1,
            ],
        ];
    }
}
