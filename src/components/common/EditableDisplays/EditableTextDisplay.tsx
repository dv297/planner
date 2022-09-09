import { CircularProgress } from '@mui/material';

import Form from '../Form';
import FormTextInput from '../FormTextInput';
import TextDisplay from './TextDisplay';
import useEditableDisplay from './useEditableDisplay';

export interface EditableTextDisplayProps {
  onBlurSubmission: (data: string) => Promise<void>;
  initialValue: string;
  textDisplayClassName?: string;
}

const EditableTextDisplay = (props: EditableTextDisplayProps) => {
  const { onBlurSubmission, initialValue, textDisplayClassName } = props;
  const {
    textValue,
    handleBlurSubmission,
    isEditing,
    isLoading,
    hasError,
    openEditor,
    handleCancelClick,
    inputRef,
    cancelButtonRef,
  } = useEditableDisplay({
    initialValue,
    onBlurSubmission,
  });

  return (
    <Form defaultValues={{ text: textValue }} onBlur={handleBlurSubmission}>
      {({ keys }) => (
        <>
          <div
            onClick={openEditor}
            className="w-full rounded-lg cursor-pointer border-2 border-white hover:border-solid hover:border-gray-100"
          >
            {!isEditing ? (
              <div className="px-4 py-1">
                <TextDisplay
                  value={textValue}
                  textDisplayClassName={textDisplayClassName}
                />
              </div>
            ) : (
              <div className="flex flex-row relative">
                <div className="flex flex-col w-full">
                  <FormTextInput name={keys.text} inputRef={inputRef} />
                </div>
                {isLoading ? (
                  <div className="absolute right-4 h-full flex items-center">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <div>
                    <button
                      className="absolute right-4 h-full"
                      onClick={handleCancelClick}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {hasError && (
            <div className="text-red-600 leading-6 font-small mt-1">
              There was an error saving your change. Make a change and try
              again.
            </div>
          )}
        </>
      )}
    </Form>
  );
};

export default EditableTextDisplay;