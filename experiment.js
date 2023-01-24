/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// number of trails
n_practice_trials = 18
n_test_trials = 150
attention_per_test_trials = 15
attention_len = Math.floor(n_test_trials / attention_per_test_trials)

// consts
left_key = 37
right_key = 39
congruent_right = ">>>>>"
congruent_left = "<<<<<"
incongruent_right = "<<><<"
incongruent_left = ">><>>"
attention_right = ">"
attention_left = "<"
CORRECT_FEEDBACK = '<div class = centerbox><div style="color:green" class = center-text>Correct!</div></div>'
INCORRECT_FEEDBACK = '<div class = centerbox><div style="color:red" class = center-text>Incorrect</div></div>'
TIMEOUT_MSG = '<div class = centerbox><div class = center-text>Please respond faster</div></div>'


/* *************************/
/* Define helper functions */

/* *************************/

var getInstructFeedback = function () {
    return `<div class = centerbox><p class = center-block-text>${feedback_instruct_text}</p></div>`
}

var changeData = function () {
    data = jsPsych.data.getTrialsOfType('text')
    practiceDataCount = 0
    testDataCount = 0
    for (i = 0; i < data.length; i++) {
        if (data[i].trial_id == 'practice_intro') {
            practiceDataCount = practiceDataCount + 1
        } else if (data[i].trial_id == 'test_intro') {
            testDataCount = testDataCount + 1
        }
    }
    if (practiceDataCount >= 1 && testDataCount === 0) {
        //temp_id = data[i].trial_id
        jsPsych.data.addDataToLastTrial({
            exp_stage: "practice"
        })
    } else if (practiceDataCount >= 1 && testDataCount >= 1) {
        //temp_id = data[i].trial_id
        jsPsych.data.addDataToLastTrial({
            exp_stage: "test"
        })
    }
}


// task specific variables
var test_stimuli = [{
    image: `<div class = centerbox><div class = flanker-text>${incongruent_right}</div></div>`,
    data: {
        correct_response: right_key,
        condition: 'incongruent',
        trial_id: 'stim'
    }
}, {
    image: `<div class = centerbox><div class = flanker-text>${incongruent_left}</div>`,
    data: {
        correct_response: left_key,
        condition: 'incongruent',
        trial_id: 'stim'
    }
}, {
    image: `<div class = centerbox><div class = flanker-text>${congruent_right}</div></div>`,
    data: {
        correct_response: right_key,
        condition: 'congruent',
        trial_id: 'stim'
    }
}, {
    image: `<div class = centerbox><div class = flanker-text>${congruent_left}</div></div>`,
    data: {
        correct_response: left_key,
        condition: 'congruent',
        trial_id: 'stim'
    }
}];

// congruent to incongruent ratio 1:2
practice_repetitions = [n_practice_trials / 3, n_practice_trials / 3, n_practice_trials / 6, n_practice_trials / 6]
test_repetitions = [n_test_trials / 3, n_test_trials / 3, n_test_trials / 6, n_test_trials / 6]

var practice_trials = jsPsych.randomization.repeat(test_stimuli, practice_repetitions, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, test_repetitions, true);

var practice_response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
    practice_response_array.push(practice_trials.data[i].correct_response)
}

var test_response_array = [];
for (i = 0; i < test_trials.data.length; i++) {
    test_response_array.push(test_trials.data[i].correct_response)
}

var attention_stimuli = [{
    image: `<div class = centerbox><div class = flanker-text>${attention_right}</div></div>`,
    data: {
        correct_response: right_key,
        trial_id: 'attention_check'
    }
}, {
    image: `<div class = centerbox><div class = flanker-text>${attention_left}</div></div>`,
    data: {
        correct_response: left_key,
        trial_id: 'attention_check'
    }
}];

// var attention_checks = jsPsych.randomization.repeat(attention_stimuli, attention_len / 2, true);
// var attention_response_array = [];
// for (i = 0; i < attention_checks.data.length; i++) {
//     attention_response_array.push(attention_checks.data[i].correct_response)
// }


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var instructions_block = {
    type: 'poldrack-instructions',
    pages: [
        `<div class = centerbox>
         <p class = block-title>Instructions</p>
         <p class = block-text>In this task you will see strings of five arrow characters. For instance, you might see ${congruent_left} or ${incongruent_left}.</p>
         <p class = block-text>Your goal is to respond <strong>as quickly as you can</strong> to the <strong>middle</strong> arrow, using the arrow keys in your keyboard:</p>
         <p class = block-text style="text-align: center;">press the <span style="color:darkgreen"><b>left arrow key</b></span> if it's <span style="color:darkgreen"><b><</b></span> <br>
         press the <span style="color:darkblue"><b>right arrow key</b></span> if it's <span style="color:darkblue"><b>></b></span></p>
         <p class = block-text><u>Example:</u> If you see ${incongruent_right}, press the right arrow key.</p>
         </div>`,

        `<div class = centerbox>
         <p class = block-title>Instructions</p>
         <p class = block-text>Do your best to stay focused. Too many wrong responses will disqualify you from payment.</p>
         <p class = block-text>We will start with a short practice round. When you're ready, click "End Instructions" below.</p>
         </div>`
    ],
    allow_keys: false,
    data: {
        trial_id: "instruction"
    },
    show_clickable_nav: true,
    timing_post_trial: 1000
};

/* This part is used to force instruction rereading if they were read too quickly. If using, the first element in
 the experiment timeline should be instruction_node instead of instructions_block */
// var feedback_instruct_text = `Welcome to the task. Press <strong>enter</strong> to begin.`
// var feedback_instruct_block = {
//     type: 'poldrack-text',
//     cont_key: [13],
//     data: {
//         trial_id: "instruction"
//     },
//     text: getInstructFeedback,
//     timing_post_trial: 0,
//     timing_response: 180000
// };
//
// var instruction_node = {
//     timeline: [feedback_instruct_block, instructions_block],
//     loop_function: function (data) {
//         // This ensures that the subject does not read through the instructions too quickly. If they do it too quickly, then we will go over the loop again.
//         for (i = 0; i < data.length; i++) {
//             if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
//                 sumInstructTime += data[i].rt
//             }
//         }
//         if (sumInstructTime <= instructTimeThresh * 1000) {
//             feedback_instruct_text = `You read through instructions too quickly. Please take your time and make sure
//             you understand the instructions. Press <strong>enter</strong> to continue.`
//             return true
//         } else if (sumInstructTime > instructTimeThresh * 1000) {
//             feedback_instruct_text = `Done with instructions. Press <strong>enter</strong> to continue.`
//             return false
//         }
//     }
// }

var end_block = {
    type: 'poldrack-text',
    timing_response: 180000,
    data: {
        trial_id: "end",
        exp_id: 'flanker'
    },
    text: `<div class = centerbox><p class = center-block-text>Task completed!</p>
           <p class = center-block-text>Press <strong>enter</strong> to continue the experiment.</p></div>`,
    cont_key: [13],
    timing_post_trial: 0
};

var start_test_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "test_intro"
    },
    timing_response: 180000,
    text: `<div class = centerbox><p class = center-block-text>Practice complete. We will now start the test round.</p>
           <p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>`,
    cont_key: [13],
    timing_post_trial: 1000
};

var fixation_block = {
    type: 'poldrack-single-stim',
    stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
    is_html: true,
    data: {
        trial_id: "fixation"
    },
    choices: 'none',
    timing_stim: 500,
    timing_response: 500,
    timing_post_trial: 0,
    on_finish: changeData,
};

//Set up experiment
flanker_experiment = []
flanker_experiment.push(instructions_block);

for (i = 0; i < n_practice_trials; i++) {
    flanker_experiment.push(fixation_block)
    var practice_block = {
        type: 'poldrack-categorize',
        stimulus: practice_trials.image[i],
        is_html: true,
        key_answer: practice_response_array[i],
        correct_text: CORRECT_FEEDBACK,
        incorrect_text: INCORRECT_FEEDBACK,
        timeout_message: TIMEOUT_MSG,
        choices: [left_key, right_key],
        data: practice_trials.data[i],
        timing_feedback_duration: 1000,
        show_stim_with_feedback: false,
        timing_response: 1500,
        timing_post_trial: 500,
        on_finish: function () {
            jsPsych.data.addDataToLastTrial({
                exp_stage: "practice"
            })
        }
    }
    flanker_experiment.push(practice_block)
}

flanker_experiment.push(start_test_block)

/* define test block */
for (i = 0; i < n_test_trials; i++) {
    /* add attention checks: */
    // if (i > 0 && i % attention_per_test_trials === 0) {
    //     flanker_experiment.push(fixation_block)
    //
    //     attention_i = (i / 15) - 1
    //     var attention_block = {
    //         type: 'poldrack-categorize',
    //         stimulus: attention_checks.image[attention_i],
    //         is_html: true,
    //         key_answer: attention_response_array[attention_i],
    //         correct_text: '',
    //         incorrect_text: '',
    //         timeout_message: TIMEOUT_MSG,
    //         choices: [left_key, right_key],
    //         data: attention_checks.data[attention_i],
    //         timing_feedback_duration: 1, // can't set to 0 because if this evaluates to false it reverts to default
    //         timing_response: 1500,
    //         show_stim_with_feedback: false,
    //         timing_post_trial: 500,
    //         on_finish: function () {
    //             jsPsych.data.addDataToLastTrial({
    //                 exp_stage: "attention"
    //             })
    //         }
    //     }
    //     flanker_experiment.push(attention_block)
    // }


    flanker_experiment.push(fixation_block)
    var test_block = {
        type: 'poldrack-categorize',
        stimulus: test_trials.image[i],
        is_html: true,
        key_answer: test_response_array[i],
        correct_text: '',
        incorrect_text: '',
        timeout_message: '',
        choices: [left_key, right_key],
        data: test_trials.data[i],
        timing_feedback_duration: 1, // can't set to 0 because if this evaluates to false it reverts to default
        timing_response: 1500,
        show_stim_with_feedback: false,
        timing_post_trial: 500,
        on_finish: function () {
            jsPsych.data.addDataToLastTrial({
                exp_stage: "test"
            })
        }
    }
    flanker_experiment.push(test_block)
}
flanker_experiment.push(end_block)