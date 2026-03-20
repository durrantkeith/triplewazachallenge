/*
  # Remove all katas except Nage no Kata

  1. Changes
    - Delete all kata_sets associated with katas other than Nage no Kata
    - Delete all katas except Nage no Kata
    
  2. Details
    - Nage no Kata (id: 07263680-2b32-43ae-857b-0e6435f0df46) will be preserved
    - The following katas will be removed:
      - Katame no Kata
      - Ju no Kata
      - Goshin Jutsu
      - Itsutsu no Kata
      - Koshiki no Kata
    - All kata_sets for the removed katas will also be deleted
    
  3. Safety
    - No submissions are currently referencing the katas being removed
*/

-- First, delete kata_sets associated with katas other than Nage no Kata
DELETE FROM kata_sets 
WHERE kata_id != '07263680-2b32-43ae-857b-0e6435f0df46';

-- Then, delete all katas except Nage no Kata
DELETE FROM katas 
WHERE id != '07263680-2b32-43ae-857b-0e6435f0df46';
