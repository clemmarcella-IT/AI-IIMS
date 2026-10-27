<?php

namespace Database\Seeders;

use App\Models\Test;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Seed the pretest and posttest assessments.
     */
    public function run(): void
    {
        $pretest = Test::query()->updateOrCreate(
            [
                'test_type' => 'pretest',
                'subject' => 'Physical Science',
                'topic' => "Newton's Laws of Motion",
            ],
            [
                'title' => "Pretest: Newton's Laws of Motion",
                'is_active' => true,
            ],
        );

        $posttest = Test::query()->updateOrCreate(
            [
                'test_type' => 'posttest',
                'subject' => 'Physical Science',
                'topic' => "Newton's Laws of Motion",
            ],
            [
                'title' => "Posttest: Newton's Laws of Motion",
                'is_active' => true,
            ],
        );

        $pretest->questions()->delete();
        $posttest->questions()->delete();

        $this->createQuestions($pretest, $this->pretestQuestions());
        $this->createQuestions($posttest, $this->posttestQuestions());
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
                'question' => 'Which statement best describes Newton\'s First Law of Motion?',
                'choices' => [
                    'A' => 'An object changes motion only when acted on by a net external force.',
                    'B' => 'Force is always equal to mass divided by acceleration.',
                    'C' => 'Every force acts without any opposite force.',
                    'D' => 'Objects always slow down because motion naturally disappears.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Newton\'s First Law states that motion stays the same unless a net external force changes it.',
                'points' => 1,
            ],
            [
                'question' => 'A book rests on a table and remains at rest. Which idea explains why it stays there?',
                'choices' => [
                    'A' => 'The book has no mass.',
                    'B' => 'The forces on the book are balanced.',
                    'C' => 'Gravity is not acting on the book.',
                    'D' => 'The table pushes the book downward.',
                ],
                'correct_answer' => 'B',
                'explanation' => 'The upward normal force balances the downward weight, so there is no net force.',
                'points' => 1,
            ],
            [
                'question' => 'What is inertia?',
                'choices' => [
                    'A' => 'The tendency of an object to resist changes in its motion.',
                    'B' => 'The force that pulls objects toward Earth.',
                    'C' => 'The speed of an object at one instant.',
                    'D' => 'The distance an object travels per second.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Inertia is resistance to changes in motion and increases with mass.',
                'points' => 1,
            ],
            [
                'question' => 'Which object has the greatest inertia?',
                'choices' => [
                    'A' => 'An empty plastic bottle.',
                    'B' => 'A basketball.',
                    'C' => 'A full backpack.',
                    'D' => 'A sheet of paper.',
                ],
                'correct_answer' => 'C',
                'explanation' => 'The full backpack has the greatest mass, so it has the greatest inertia.',
                'points' => 1,
            ],
            [
                'question' => 'Newton\'s Second Law is commonly written as:',
                'choices' => [
                    'A' => 'F = ma',
                    'B' => 'a = mF',
                    'C' => 'F = m/a',
                    'D' => 'm = Fa',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Newton\'s Second Law relates net force, mass, and acceleration as F = ma.',
                'points' => 1,
            ],
            [
                'question' => 'If the same force is applied to two carts, the cart with less mass will:',
                'choices' => [
                    'A' => 'Accelerate more.',
                    'B' => 'Accelerate less.',
                    'C' => 'Have zero acceleration.',
                    'D' => 'Move only if friction is absent.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'For the same force, acceleration is greater when mass is smaller.',
                'points' => 1,
            ],
            [
                'question' => 'A 3 kg object accelerates at 2 m/s^2. What net force acts on it?',
                'choices' => [
                    'A' => '1.5 N',
                    'B' => '5 N',
                    'C' => '6 N',
                    'D' => '9 N',
                ],
                'correct_answer' => 'C',
                'explanation' => 'Using F = ma, force is 3 kg x 2 m/s^2 = 6 N.',
                'points' => 1,
            ],
            [
                'question' => 'Which pair is an action-reaction pair?',
                'choices' => [
                    'A' => 'A hand pushes a wall, and the wall pushes the hand.',
                    'B' => 'Earth pulls a ball down, and air pushes the ball sideways.',
                    'C' => 'A car moves forward, and friction slows it down.',
                    'D' => 'A table supports a book, and gravity pulls the book down.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Action-reaction forces are equal and opposite forces between two interacting objects.',
                'points' => 1,
            ],
            [
                'question' => 'When a swimmer pushes water backward, the swimmer moves forward because:',
                'choices' => [
                    'A' => 'The water exerts an equal and opposite force on the swimmer.',
                    'B' => 'The swimmer removes all friction from the water.',
                    'C' => 'The swimmer\'s mass becomes smaller.',
                    'D' => 'Gravity pushes the swimmer forward.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'This is Newton\'s Third Law: the water pushes back on the swimmer.',
                'points' => 1,
            ],
            [
                'question' => 'A passenger lurches forward when a moving jeepney suddenly stops. Which law best explains this?',
                'choices' => [
                    'A' => 'Newton\'s First Law.',
                    'B' => 'Newton\'s Second Law.',
                    'C' => 'Newton\'s Third Law.',
                    'D' => 'Law of Universal Gravitation only.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The passenger\'s body tends to keep moving forward because of inertia.',
                'points' => 1,
            ],
        ];
    }

    private function posttestQuestions(): array
    {
        return [
            [
                'question' => 'A ball rolling on a smooth floor keeps moving until friction or another force slows it. Which law is shown?',
                'choices' => [
                    'A' => 'Newton\'s First Law.',
                    'B' => 'Newton\'s Second Law.',
                    'C' => 'Newton\'s Third Law.',
                    'D' => 'Conservation of charge.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The ball tends to maintain its motion unless a net force changes it.',
                'points' => 1,
            ],
            [
                'question' => 'A picture frame hanging still on a wall has no acceleration because:',
                'choices' => [
                    'A' => 'Its forces are balanced.',
                    'B' => 'It has no weight.',
                    'C' => 'It has no inertia.',
                    'D' => 'Only one force acts on it.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Balanced forces produce zero net force, so the frame does not accelerate.',
                'points' => 1,
            ],
            [
                'question' => 'Why is it harder to start pushing a loaded cart than an empty cart?',
                'choices' => [
                    'A' => 'The loaded cart has more inertia.',
                    'B' => 'The empty cart has more inertia.',
                    'C' => 'The loaded cart has no acceleration.',
                    'D' => 'The empty cart has no mass.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'Greater mass means greater inertia and more resistance to changes in motion.',
                'points' => 1,
            ],
            [
                'question' => 'Which situation shows inertia most clearly?',
                'choices' => [
                    'A' => 'Dust leaves a rug when the rug is quickly shaken.',
                    'B' => 'A magnet attracts iron filings.',
                    'C' => 'A lamp lights when switched on.',
                    'D' => 'Ice melts in sunlight.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The dust tends to remain at rest while the rug moves suddenly.',
                'points' => 1,
            ],
            [
                'question' => 'If net force doubles while mass stays the same, acceleration will:',
                'choices' => [
                    'A' => 'Double.',
                    'B' => 'Be cut in half.',
                    'C' => 'Stay exactly the same.',
                    'D' => 'Become zero.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'From F = ma, acceleration is directly proportional to net force for constant mass.',
                'points' => 1,
            ],
            [
                'question' => 'Two students push identical boxes. One uses a larger net force. That box will:',
                'choices' => [
                    'A' => 'Have greater acceleration.',
                    'B' => 'Have less mass.',
                    'C' => 'Have no reaction force.',
                    'D' => 'Move with no friction at all.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'With equal mass, the larger net force produces larger acceleration.',
                'points' => 1,
            ],
            [
                'question' => 'What is the net force on a 5 kg object accelerating at 4 m/s^2?',
                'choices' => [
                    'A' => '9 N',
                    'B' => '16 N',
                    'C' => '20 N',
                    'D' => '25 N',
                ],
                'correct_answer' => 'C',
                'explanation' => 'F = ma = 5 kg x 4 m/s^2 = 20 N.',
                'points' => 1,
            ],
            [
                'question' => 'When a foot kicks a soccer ball, the matching reaction force is:',
                'choices' => [
                    'A' => 'The ball pushes back on the foot.',
                    'B' => 'Earth pulls down on the ball.',
                    'C' => 'Air pushes forward on the ball.',
                    'D' => 'The ground pushes up on the player.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The ball exerts an equal and opposite force on the foot.',
                'points' => 1,
            ],
            [
                'question' => 'A rocket moves upward as exhaust gases are pushed downward. This demonstrates:',
                'choices' => [
                    'A' => 'Newton\'s Third Law.',
                    'B' => 'Newton\'s First Law only.',
                    'C' => 'Inertia with no forces.',
                    'D' => 'Balanced forces only.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The downward push on gases creates an upward reaction force on the rocket.',
                'points' => 1,
            ],
            [
                'question' => 'A student wearing a seatbelt is held back when a car stops quickly. What does the seatbelt do?',
                'choices' => [
                    'A' => 'Applies a force that changes the student\'s forward motion.',
                    'B' => 'Removes the student\'s inertia.',
                    'C' => 'Increases the student\'s mass.',
                    'D' => 'Cancels gravity completely.',
                ],
                'correct_answer' => 'A',
                'explanation' => 'The seatbelt provides the external force needed to slow the student safely.',
                'points' => 1,
            ],
        ];
    }
}
